import { useAuth } from '~/utils/auth';
import { z } from 'zod';
import { scopedLogger } from '~/utils/logger';

const log = scopedLogger('user-profile');

const userProfileSchema = z.object({
  profile: z.object({
    icon: z.string(),
    colorA: z.string(),
    colorB: z.string(),
  }).optional(),
  nickname: z.string().min(1).max(255).optional(),
});

export default defineEventHandler(async event => {
  // User route logic disabled during migration
  return { message: "Migrating to Firebase, route temporarily disabled" };
});
