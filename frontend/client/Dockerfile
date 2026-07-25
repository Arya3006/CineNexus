# Build Stage
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Builds the static Vite HTML/JS files
RUN npm run build

# Production Stage (Nginx)
FROM nginx:alpine
# Copy the built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default Nginx config with our custom port 5173 config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]