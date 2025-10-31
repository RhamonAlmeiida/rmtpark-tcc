# Etapa 1 - build do Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Etapa 2 - servir os arquivos estáticos com Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist/rmtpark-frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
