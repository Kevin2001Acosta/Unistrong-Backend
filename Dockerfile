# Usa una imagen base de Node.js (ajusta según tu entorno)
FROM node:16

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de tu proyecto
COPY package*.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia todos los archivos del proyecto
COPY . .

# Copia el archivo .env.local para pruebas locales


# Expone el puerto
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm","start"]