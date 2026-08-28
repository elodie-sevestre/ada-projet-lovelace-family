# Installation

## Prérequis

Avant de lancer le projet, assure-toi d'avoir installé :

- [Docker](https://www.docker.com/) et Docker Compose (inclus par défaut avec Docker Desktop)
- [Git](https://git-scm.com/)

Node.js n'est **pas nécessaire** en local : le frontend et le backend tournent tous les deux dans des conteneurs Docker, avec leurs dépendances installées à l'intérieur.

## Cloner le repo

```bash
git clone git@github.com:elodie-sevestre/ada-projet-lovelace-family.git
cd ada-projet-lovelace-family
```

## Configurer les variables d'environnement

Le backend a besoin d'un fichier `.env` (non versionné) pour se connecter à la base de données. Un modèle est fourni dans `back/.env.example`.

```bash
cp back/.env.example back/.env
```

Les valeurs par défaut fonctionnent telles quelles pour un environnement de développement local : ce sont uniquement des identifiants du conteneur PostgreSQL, pas des secrets de production.

## Lancer le projet

Une fois les variables d'environnement configurées, démarre l'ensemble des services avec Docker Compose depuis la racine du projet :

```bash
docker compose up --build
```

L'option `--build` force la reconstruction des images (utile la première fois, ou après une modification des `Dockerfile`/dépendances). Pour les lancements suivants, un simple `docker compose up` suffit.

Cette commande démarre trois services :

| Service    | Rôle                       | Port exposé |
| ---------- | -------------------------- | ----------- |
| `frontend` | Application React (Vite)   | `5173`      |
| `backend`  | API Express (Node.js)      | `5000`      |
| `postgres` | Base de données PostgreSQL | `5432`      |

Le service `backend` attend que `postgres` soit prêt (`healthcheck`) avant de démarrer.

Pour arrêter les services :

```bash
docker compose down
```

> Le port `9229` est également exposé sur le service `backend` : il s'agit du port d'inspection Node.js, utilisé pour brancher un débogueur (VS Code, Chrome DevTools) sur le processus qui tourne dans le conteneur.

## Vérifier que ça fonctionne

Une fois `docker compose up --build` lancé et les trois services démarrés :

- **Frontend** : ouvre [http://localhost:5173](http://localhost:5173) dans ton navigateur — l'application React doit s'afficher.
- **Backend** : l'API est accessible sur [http://localhost:5000](http://localhost:5000)
- **Base de données** : PostgreSQL est accessible sur le port `5432` (utile si tu veux t'y connecter avec un client comme DBeaver ou psql).

Si le frontend n'arrive pas à contacter le backend, vérifie la variable `VITE_API_URL` définie dans `docker-compose.yml`.
