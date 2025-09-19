# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first (better layer cache)
COPY package*.json ./
# If you don't have a package-lock.json, this will fall back to npm install
RUN npm ci || npm install

# Copy source and build
COPY . .
RUN npm run build

# --- Runtime stage (Nginx) ---
FROM nginx:alpine
# Copy compiled app
COPY --from=build /app/dist /usr/share/nginx/html

# Single Page App routing + basic caching
RUN <<'EOF' cat > /etc/nginx/conf.d/default.conf
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss image/svg+xml;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache static assets aggressively (fingerprinted filenames)
  location ~* \.(?:js|css|woff2?|ttf|eot|ico|png|jpg|jpeg|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri /index.html =404;
  }
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
