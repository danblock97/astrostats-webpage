# --- Build stage ---
FROM node:20-alpine AS builder

# Do not set NODE_ENV=production in the builder stage; devDeps are needed
# Keep build free of secrets; Next.js only needs public envs at build time.
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Needed by some Node binaries on Alpine
RUN apk add --no-cache libc6-compat

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source and build
COPY . .
RUN npm run build


# --- Runtime stage ---
FROM node:20-alpine AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the built app artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Health: avoid running as root
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3000

# Run Next.js in production, binding to all interfaces and honoring $PORT
CMD ["sh", "-c", "npm run start -- -H 0.0.0.0 -p ${PORT:-3000}"]
