# ============================================
# STAGE 1: Build
# ============================================
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build the static site
RUN npm run build

# ============================================
# STAGE 2: Production (Nginx)
# ============================================
FROM nginx:1.27-alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user for security
RUN adduser -D -u 1001 -g 1001 fullpos && \
    chown -R fullpos:fullpos /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

USER fullpos

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
