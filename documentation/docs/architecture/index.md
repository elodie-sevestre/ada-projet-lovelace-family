# Architecture

Vue d'ensemble de la communication entre les trois couches : **Front-end** (React/Vite), **Back-end** (Node.js/Express) et **Base de données** (PostgreSQL).

## Schéma général

```
[ Front-end (React) ]  --fetch HTTP-->  [ Back-end (Express) ]  --pg-->  [ PostgreSQL ]
  front/src/api/*.js        JSON         routes → controllers
                                          → services → models
```

## Front-end → Back-end

Le front n'utilise aucune librairie de requêtes tierce : `front/src/api/client.js` encapsule `fetch` (`get`, `post`, `put`, `del`) autour d'une `BASE_URL` fixe (`http://localhost:5000/api`).

Chaque ressource a son propre module (`api/tasks.js`, `api/users.js`) qui appelle `client.js` et renvoie une Promise consommée par les composants (`.then(...)`). Pas de state manager global : chaque composant garde son état via `useState`/`useEffect`.

## Back-end : architecture en couches

`back/src/` suit un découpage strict en 4 couches :

1. **routes/** — déclare les endpoints HTTP, aiguille vers un controller
2. **controllers/** — valide les entrées, appelle un service, formate la réponse HTTP
3. **services/** — logique métier
4. **models/** — requêtes SQL brutes via `pg`

Chaque requête traverse ces 4 couches dans l'ordre pour atteindre la base de données, puis remonte la réponse en sens inverse.

## Back-end → Base de données

`back/src/models/configDb.js` crée un `Pool` PostgreSQL unique (variables d'environnement `POSTGRES_*`), réutilisé par tous les models. Pas d'ORM : chaque model écrit ses requêtes SQL directement avec `pg`.

## Authentification

Le token JWT (émis par `POST /auth/connexion`) est stocké côté front en `localStorage` et doit être envoyé dans l'en-tête `Authorization: Bearer <token>` pour tout endpoint sous `/api/tasks` et `/api/users`. Le middleware `requireAuth` (back) vérifie ce token à chaque requête protégée.

> À date, `front/src/api/client.js` n'ajoute pas encore cet en-tête automatiquement — voir axes d'amélioration du [Back-end](../back/index.md#axes-damélioration).

## Voir aussi

- [Front-end](../front/index.md) — détail des composants React
- [Back-end](../back/index.md) — détail des routes et flux
- [Base de données](../base-de-donnees/index.md) — schéma des tables
