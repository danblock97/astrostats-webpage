# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Completely replace the main nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Remove default config directory to avoid conflicts
RUN rm -rf /etc/nginx/conf.d/*

COPY --from=builder /app/out /usr/share/nginx/html

# Add curl for health checks
RUN apk add --no-cache curl

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["nginx", "-g", "daemon off;"]