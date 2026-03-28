# Etapa 1: Compilación
FROM node:20-alpine AS build
WORKDIR /app

# Instalar Angular CLI globalmente para evitar el error 'ng not found'
RUN npm install -g @angular/cli

# Copiar archivos de dependencias primero para aprovechar el caché de capas
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Ejecutar el build de producción
RUN npm run build -- --configuration production

# Etapa 2: Servidor de producción ligero
FROM nginx:alpine

# Copiamos la configuración de Nginx que creamos antes
COPY nginx.conf /etc/nginx/conf.d/default.conf

# IMPORTANTE: Ruta basada en tu angular.json
# El nuevo builder pone los archivos en dist/pf_front/browser
COPY --from=build /app/dist/pf_front/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]