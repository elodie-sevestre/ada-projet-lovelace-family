---
sidebar_position: 2
description: Pour l'équipe au quotidien. Répond à « où est quoi dans le backend, et quelles variables d'environnement ? ».
---

# Backend

Stack : **Node.js / Express**, requêtes SQL brutes via le package `pg` (pas d'ORM — voir [ADR 001](../explications/adr/001-pas-d-orm.md)).

## Structure

```
back/src/
├── server.js          # point d'entrée : configure Express, CORS, monte les routes
├── routes/            # définit les endpoints HTTP et les associe à un controller
├── controllers/       # valide les entrées (req.body, req.params), appelle un service, formate la réponse HTTP
├── services/          # logique métier
├── models/            # requêtes SQL via pg
├── middlewares/       # middlewares Express (requireAuth, etc.)
└── config/            # configuration (variables d'environnement)
```

Découpage en couches : `routes` (aiguillage) → `controllers` (validation + format HTTP) → `services` (logique métier) → `models` (SQL brut).

## Connexion à la base de données

`back/src/models/configDb.js` crée un `Pool` PostgreSQL unique à partir des variables d'environnement, réutilisé par tous les models. Un pool évite de rouvrir une connexion à chaque requête.

## Variables d'environnement

Modèle dans `back/.env.example`. Cette liste fait foi dans ce fichier.

| Variable            | Rôle                                             | Obligatoire | Défaut        |
| ------------------- | ----------------------------------------------- | ----------- | ------------- |
| `POSTGRES_USER`     | utilisateur PostgreSQL                          | oui         | —             |
| `POSTGRES_PASSWORD` | mot de passe PostgreSQL                         | oui         | —             |
| `POSTGRES_DB`       | nom de la base                                  | oui         | `lovelace_db` |
| `POSTGRES_HOST`     | hôte PostgreSQL (nom du service Docker Compose) | oui         | `postgres`    |
| `POSTGRES_PORT`     | port PostgreSQL                                 | oui         | `5432`        |
| `JWT_SECRET`        | clé de signature des tokens JWT (≥ 32 car. en production) | oui | —          |
| `PORT`              | port d'écoute du serveur Express                | non         | `5000`        |
| `NODE_ENV`          | `development` \| `production` \| `test`         | non         | `development` |

`VITE_API_URL` est définie dans `docker-compose.yml` pour le frontend, mais actuellement contournée par une URL en dur — voir [ADR 003](../explications/adr/003-url-api-en-dur.md).

> Dans un `.env.example`, on vide les secrets (`POSTGRES_PASSWORD`, `JWT_SECRET`) et on renseigne ce qui est imposé mais public (noms de service, ports).

## Tests

Voir [Lancer les tests](../guides/lancer-les-tests.md).
