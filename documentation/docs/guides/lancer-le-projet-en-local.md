---
sidebar_position: 1
description: Pour toute personne qui doit faire tourner le projet sur sa machine. Répond à « comment je lance le projet en local ? ».
---

# Lancer le projet en local

## Prérequis

- **[Git](https://git-scm.com/downloads)** — cloner le dépôt et gérer les branches
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** — lancer frontend, backend et base de données sans rien installer d'autre

Node.js n'est **pas nécessaire** : le frontend et le backend tournent dans des conteneurs Docker, avec leurs dépendances installées à l'intérieur.

## Cloner le dépôt

```bash
git clone git@github.com:elodie-sevestre/ada-projet-lovelace-family.git
cd ada-projet-lovelace-family
cp back/.env.example back/.env
```

## Configurer le `.env`

Le backend a besoin de `back/.env` (non versionné) pour se connecter à la base et signer les tokens. La liste complète des variables est dans [Référence — Variables d'environnement](../reference/backend.md#variables-denvironnement).

Règle : dans un `.env`, on remplit ce qui est imposé mais public (noms de service, ports) et on renseigne les secrets à part.

- `POSTGRES_USER`, `POSTGRES_PASSWORD` : au choix en local, aucun enjeu de sécurité.
- `JWT_SECRET` : à demander à Elodie pour un environnement partagé, ou à générer en local :

  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

## Démarrer les services

```bash
docker compose up --build
```

`--build` force la reconstruction des images (première fois, ou après modification des `Dockerfile` / dépendances). Ensuite, `docker compose up` suffit.

| Service    | Rôle                       | Port exposé |
| ---------- | -------------------------- | ----------- |
| `frontend` | Application React (Vite)   | `5173`      |
| `backend`  | API Express (Node.js)      | `5000`      |
| `postgres` | Base de données PostgreSQL | `5432`      |

Le service `backend` attend que `postgres` soit prêt (`healthcheck`) avant de démarrer.

Arrêter les services :

```bash
docker compose down
```

> Le port `9229` est aussi exposé sur `backend` : c'est le port d'inspection Node.js, pour brancher un débogueur (VS Code, Chrome DevTools) sur le processus du conteneur.

## Initialiser la base

La base démarre vide. Voir [Initialiser la base de données](./initialiser-la-bdd.md).

## Vérifier que ça fonctionne

- **Frontend** : [http://localhost:5173](http://localhost:5173) — l'application React doit s'afficher.
- **Backend** : l'API répond sur [http://localhost:5000](http://localhost:5000).
- **Base de données** : PostgreSQL sur le port `5432` (client type DBeaver, extension VS Code, ou `psql`).

Si le frontend n'arrive pas à contacter le backend, vérifie `VITE_API_URL` dans `docker-compose.yml` — voir aussi [ADR 003](../explications/adr/003-url-api-en-dur.md).

> Ports déjà pris sur ta machine ? Ils s'adaptent dans `docker-compose.yml` et le `.env`.
