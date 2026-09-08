---
sidebar_position: 1
description: Pour l'équipe au quotidien. Répond à « quel endpoint, quel corps de requête, quel code retour ? ».
---

# API HTTP

Base : `http://localhost:5000`. Le frontend appelle l'API via `front/src/api/client.js` (base actuellement codée en dur `http://localhost:5000/api` — voir [ADR 003](../explications/adr/003-url-api-en-dur.md)). Réponses au format JSON.

## Authentification

Deux endpoints publics ; tout le reste exige un token JWT.

### `POST /auth/inscription`

Crée un nouvel utilisateur.

- Corps : `{ mail, password, name, tribe_name }`
- Réponse : `{ userId, role, message }`
- Le mot de passe est haché avec `bcryptjs` avant stockage.

### `POST /auth/connexion`

Authentifie un utilisateur.

- Corps : `{ mail, password }`
- Réponse : `{ token }` — JWT valide 24 h, contient `{ userId, role }`
- Stocké dans le `localStorage` côté frontend (voir [ADR 002](../explications/adr/002-jwt-localstorage.md)).

### Endpoints protégés

Tout ce qui est sous `/api/tasks` et `/api/users` passe par le middleware `requireAuth` (`back/src/middlewares/requireAuth.js`), qui lit l'en-tête `Authorization: Bearer <token>` :

- token valide et non expiré → la requête continue ;
- absent, invalide ou expiré → `401 Unauthorized`.

## Routes

### `/auth` — public

| Méthode | Endpoint       | Controller              | Validation                       |
| ------- | -------------- | ----------------------- | -------------------------------- |
| POST    | `/inscription` | `createLoginController` | mail, password, name, tribe_name |
| POST    | `/connexion`   | `connexionController`   | mail, password                   |

### `/api/users` — protégé

| Méthode | Endpoint | Controller              | Rôle requis |
| ------- | -------- | ----------------------- | ----------- |
| GET     | `/`      | `getAllUsersController` | aucun       |

Renvoie la liste des utilisateurs de la tribu, sans les mots de passe hachés.

### `/api/tasks` — protégé

| Méthode | Endpoint     | Controller                 | Rôle requis      |
| ------- | ------------ | -------------------------- | ---------------- |
| GET     | `/`          | `getAllTasksController`     | aucun            |
| GET     | `/users/:id` | `getTasksByUserController`  | aucun            |
| POST    | `/`          | `createTaskController`      | ADMIN            |
| PUT     | `/:id`       | `updateTaskController`      | ADMIN ou assigné |
| DELETE  | `/:id`       | `deleteTaskController`      | ADMIN            |

`GET /api/tasks` et `GET /api/tasks/users/:id` renvoient un objet `{ toDoTasks, finishedTasks }` : le tri par statut est fait côté backend.

> Le contrôle de rôle « ADMIN ou assigné » sur `PUT` n'est pas encore appliqué de bout en bout — voir [Limites et dette](../explications/limites-et-dette.md).

## Codes retour de `DELETE /api/tasks/:id`

| Cas                         | Code HTTP            |
| --------------------------- | ------------------- |
| Id invalide (pas un entier) | `400`               |
| Tâche inexistante           | `404`               |
| Suppression réussie         | `204` (sans corps)  |
| Erreur serveur imprévue     | `500`               |

Le parcours complet d'une requête est décrit dans [Flux applicatifs](../explications/flux-applicatifs.md).
