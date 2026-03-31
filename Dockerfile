# Stage 1: Construção da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Servidor Web Nginx
FROM nginx:alpine

# Remove os arquivos padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos transpilados do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia a configuração própria
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
