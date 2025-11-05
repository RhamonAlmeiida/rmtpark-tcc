# Etapa 1 - Build do Angular
FROM node:20 AS build

WORKDIR /app

# Copia package.json e package-lock.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia todo o código e faz o build de produção
COPY . .
RUN npm run build

# Etapa 2 - Servir arquivos com Nginx
FROM nginx:stable-alpine

# Remove configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d

# Copia os arquivos do build Angular
COPY --from=build /app/dist/rmt-park/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
