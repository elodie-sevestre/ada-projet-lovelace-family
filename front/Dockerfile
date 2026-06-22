# Dockerfile pour Frontend Vite React

FROM node:20-alpine

WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le code source
COPY . .

# Expose le port Vite
EXPOSE 5173

# Lance le serveur de dev
CMD ["npm", "run", "dev"]
