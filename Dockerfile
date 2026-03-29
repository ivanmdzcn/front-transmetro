# Etapa 1: Compilación
FROM node:20-alpine AS build
WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration production

# Etapa 2: Servidor de producción ligero
FROM nginx:alpine

RUN apk add --no-cache gettext

COPY --from=build /app/dist/pb-front/browser /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '$API_PROXY_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]