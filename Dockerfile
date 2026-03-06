FROM node:22-alpine
WORKDIR /app

# Install curl (for Coolify healthchecks)
RUN apk add --no-cache curl

# 1. Copy dependency files first to maximize Docker layer caching
COPY package*.json ./
RUN npm install

# 2. Copy All folders for future proofing incase of custom setups later on
COPY . .

# 3. Define build arguments (ARGs). 
ARG META_NAME
ARG META_DESCRIPTION
ARG CRYPTO_SECRET
ARG TMDB_API_KEY
ARG CAPTCHA=false
ARG CAPTCHA_CLIENT_KEY
ARG TRAKT_CLIENT_ID
ARG TRAKT_SECRET_ID
ARG FIREBASE_SERVICE_ACCOUNT

# 4. Build the application (it will use the ARGs above during compilation)
RUN npm run build

# 5. Set ONLY the essential, safe runtime variable.
ENV NODE_ENV=production

EXPOSE 3000

# Start the server
CMD ["node", ".output/server/index.mjs"]
