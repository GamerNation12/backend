import { createClient } from 'redis';

// Environment variables
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const REDIS_URL = process.env.REDIS_URL;
const TOKEN_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

// Redis client
let redisClient: any = null;

// Initialize Redis client
async function initRedis() {
  if (redisClient) return redisClient;

  try {
    redisClient = createClient({ url: REDIS_URL });
    redisClient.on('error', (err: any) => console.error('Redis Client Error', err));
    await redisClient.connect();
    console.log('Connected to Redis for Turnstile caching');
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return null;
  }
}

// Validate turnstile token with Cloudflare
async function validateTurnstileToken(token: string, remoteip?: string) {
  if (!TURNSTILE_SECRET_KEY) {
    console.warn('TURNSTILE_SECRET_KEY not set, skipping validation');
    return false;
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', TURNSTILE_SECRET_KEY);
    params.append('response', token);

    // Include remote IP if provided (helps prevent abuse)
    if (remoteip) {
      params.append('remoteip', remoteip);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Turnstile validation error:', error);
    return false;
  }
}

// Check if token is cached in Redis
async function isTokenValid(token: string) {
  if (!redisClient) return false;

  try {
    const cached = await redisClient.get(`turnstile:${token}`);
    return cached === 'valid';
  } catch (error) {
    console.error('Redis token check error:', error);
    return false;
  }
}

// Store valid token in Redis with expiration
async function storeValidToken(token: string) {
  if (!redisClient) return;

  try {
    await redisClient.setEx(`turnstile:${token}`, TOKEN_CACHE_DURATION / 1000, 'valid');
  } catch (error) {
    console.error('Redis token store error:', error);
  }
}

export default defineEventHandler(async event => {
  // Skip if Turnstile is not configured
  if (!TURNSTILE_SECRET_KEY || !REDIS_URL) {
    return;
  }

  // Initialize Redis if not already done
  await initRedis();

  const token = getHeader(event, 'x-turnstile-token');

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
      data: {
        error: 'Authentication required',
        message: 'X-Turnstile-Token header is required'
      }
    });
  }

  const isValid = await isTokenValid(token);
  if (!isValid) {
    // Get remote IP for validation
    const remoteip = getRequestIP(event) ||
                     getHeader(event, 'cf-connecting-ip') ||
                     getHeader(event, 'x-forwarded-for');

    // Validate token with Cloudflare
    const isValidFromCloudflare = await validateTurnstileToken(token, remoteip);

    if (!isValidFromCloudflare) {
      throw createError({
        statusCode: 401,
        message: 'Invalid token',
        data: {
          error: 'Invalid token',
          message: 'Turnstile token validation failed'
        }
      });
    }

    // Store valid token in Redis
    await storeValidToken(token);
  }
});
