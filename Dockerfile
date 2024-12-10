# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json para instalar dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente
COPY . .

# Compila TypeScript a JavaScript
RUN npx tsc

# Expón el puerto 3001
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
