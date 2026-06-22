# Dockerfile pour Backend Express Node.js

FROM node:20-alpine

WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le code source
COPY . .

# Expose le port Express
EXPOSE 5000

# Lance le serveur
CMD ["npm", "run", "dev"]
