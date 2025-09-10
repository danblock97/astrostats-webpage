# --- Build stage ---
FROM node:20-alpine AS builder

# Do not set NODE_ENV=production in the builder stage; devDeps are needed
# Provide safe placeholder envs required during Next.js build (not used at runtime)
ENV NEXT_TELEMETRY_DISABLED=1 \
    STRIPE_SECRET_KEY="placeholder" \
    MONGODB_URI="mongodb://localhost:27017/placeholder" \
    MONGODB_DB="astrostats" \
    NEXTAUTH_SECRET="placeholder"

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
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

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

# Run Next.js in production
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
