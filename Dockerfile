FROM node:20-slim
# Carpeta de trabajo
WORKDIR /app
# Copiar dependencias y instalarlas en la carpeta de trabajo
COPY package*.json ./
RUN npm ci
# Copiar el resto del código en la carpeta de trabajo
COPY . .
# Exponer puerto (informativo)
EXPOSE 3000
# Usuario no root
RUN adduser --disabled-password appuser
USER appuser
# Comando de arranque
CMD ["npm", "start"]