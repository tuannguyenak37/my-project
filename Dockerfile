# Stage 1: build React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build       # tạo /app/build/client

# Stage 2: serve bằng Nginx
FROM nginx:alpine
COPY --from=build /app/build/client /usr/share/nginx/html  
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
