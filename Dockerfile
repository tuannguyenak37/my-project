# Stage 1: Build React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # tạo build/client

# Stage 2: Serve React bằng Nginx
FROM nginx:stable-alpine
# Copy thư mục build/client thay vì build mặc định
COPY --from=build /app/build/client /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
