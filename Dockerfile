# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Replace 'npm run build' if your build command is different
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine
# Assuming the build output is in the 'out' folder. Adjust if necessary.
COPY --from=builder /app/out /usr/share/nginx/html
# Copy custom Nginx config if you have one, otherwise Nginx default is used
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
