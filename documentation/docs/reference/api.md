---
sidebar_position: 1
description: Pour l'équipe au quotidien. Répond à « quel endpoint, quel corps de requête, quel code retour ? ».
---

# API HTTP

Base : `http://localhost:5000`. Le frontend appelle l'API via `front/src/api/client.js` (base actuellement codée en dur `http://localhost:5000/api` — voir [ADR 003](../explications/adr/003-url-api-en-dur.md)). Réponses au format JSON, sauf mention contraire (`204` sans corps).

Trois groupes de routes, montés dans `back/src/server.js` :

| Préfixe      | Fichier de routes            | Protection                     |
| ------------ | ----------------------------- | ------------------------------- |
| `/auth`      | `routes/loginRoutes.js`       | public                          |
| `/api/users` | `routes/usersRoutes.js`       | `requireAuth` (toutes les routes) |
| `/api/tasks` | `routes/tasksRoutes.js`       | `requireAuth` + rôle selon la route |

## Authentification

### `POST /auth/inscription`

Crée un nouvel utilisateur. Controller : `createLoginController`.

- **Corps** : `{ role, name, mail, tribe_name, password }`
- **Validation** : `name`, `mail`, `password` obligatoires → `400 "Champs requis manquants"` sinon. `role` et `tribe_name` ne sont pas validés dans le controller.
- **Réponse succès** : `204` — **sans corps**. Le hash du mot de passe n'est jamais renvoyé.
- **Erreurs** :
  - `400` — champ requis manquant
  - `409 "Inscription impossible"` — email déjà utilisé (contrainte unique en base, code Postgres `23505`)

Le mot de passe est haché avec `bcryptjs` (`bcrypt.hash(password, 10)`) avant stockage.

### `POST /auth/connexion`

Authentifie un utilisateur. Controller : `connexionController`.

- **Corps** : `{ mail, password }`
- **Validation**, dans l'ordre :
  1. `mail` et `password` présents → sinon `400 "Email et mot de passe requis"`
  2. `mail` doit respecter un format email (regex) → sinon `400 "Format Email invalide"`
  3. `password` doit faire au moins 8 caractères → sinon `400 "Format password invalide"`
- **Réponse succès** : `200 { token }`
- **Erreur** : `401 "Identifiants invalides"` — email inconnu **ou** mot de passe incorrect (le message ne précise pas lequel des deux).

Le token est un **JWT signé, valide 3 heures** (`expiresIn: '3h'`), avec pour payload `{ userId, role }` — aucune donnée sensible dedans. Il est stocké dans le `localStorage` côté frontend (voir [ADR 002](../explications/adr/002-jwt-localstorage.md)).

### Protection des routes `/api/*`

Toutes les routes sous `/api/users` et `/api/tasks` passent par le middleware `requireAuth` (`back/src/middlewares/requireAuthentication.js`), qui lit l'en-tête `Authorization: Bearer <token>` :

- en-tête absent ou mal formé → `401 "Token manquant"`
- token invalide ou expiré → `401 "Token invalide ou expiré"`
- token valide → `req.user` est peuplé avec `{ userId, role }` extrait du JWT, la requête continue.

Certaines routes ajoutent en plus `createCheckRoleMiddleware(ROLE.Admin)` (`back/src/middlewares/checkRole.js`) :

- rôle du token ≠ rôle attendu → **`404 "Not found"`** (pas `403`)
- rôle correspondant → la requête continue.

Les rôles possibles sont définis dans `back/src/constants.js` : `ROLE.Admin = 'ADMIN'`, `ROLE.Member = 'MEMBER'`.

## Routes `/api/users`

| Méthode | Endpoint | Controller              | Rôle requis |
| ------- | -------- | ------------------------ | ----------- |
| GET     | `/`      | `getAllUsersController`  | aucun (juste authentifié) |

### `GET /api/users`

- **Réponse** : `200`, tableau d'utilisateurs. Chaque objet contient `id, name, role, total_points` — la requête SQL sélectionne explicitement ces colonnes, le hash du mot de passe et l'email ne sont jamais renvoyés.

> **⚠️ Écart avec les notes précédentes du projet** : il avait été question d'une route `GET /api/users/:id` réservée au rôle Admin. Elle n'existe pas dans `usersRoutes.js` sur `develop` au moment de la rédaction de cette page — seule la route `/` ci-dessus existe. Si cette route a été ajoutée depuis sur une autre branche, cette page est à mettre à jour en conséquence.

## Routes `/api/tasks`

| Méthode | Endpoint     | Controller                  | Rôle requis |
| ------- | ------------ | ---------------------------- | ----------- |
| GET     | `/`          | `getAllTasksController`      | ADMIN       |
| GET     | `/users`     | `getTasksByUserController`   | aucun *(voir note)* |
| GET     | `/users/:id` | `getTasksByUserIdController` | ADMIN       |
| POST    | `/`          | `createTaskController`       | ADMIN       |
| PUT     | `/:id`       | `updateTaskController`       | ADMIN       |
| DELETE  | `/:id`       | `deleteTaskController`       | ADMIN       |

> **Note sur `GET /users`** : la vérification de rôle est présente dans le code mais **commentée** (`// createCheckRoleMiddleware(ROLE.Member)`) — la route est donc accessible à n'importe quel utilisateur authentifié, Admin ou Member, pour l'instant.

### `GET /api/tasks`

Toutes les tâches, tous utilisateurs confondus.

- **Réponse** : `200 { toDoTasks, finishedTasks }` — deux tableaux, découpés côté service selon le champ `status`.

### `GET /api/tasks/users`

Les tâches de l'utilisateur **actuellement connecté** — l'id est lu depuis le token (`req.user.userId`), pas depuis l'URL.

- **Réponse** : `200 { toDoTasks, finishedTasks }`, tâches de cet utilisateur uniquement.

### `GET /api/tasks/users/:id`

Les tâches d'un utilisateur donné par son id — réservé aux Admin.

- **Paramètre** : `id` — doit être un nombre, sinon `400 "L'id de l'utilisateur doit être un nombre valide."`
- **Réponse** : `200 { toDoTasks, finishedTasks }`

### `POST /api/tasks`

Crée une tâche. Réservé aux Admin.

- **Corps** : `{ name, description, assignment, points }`
- **Validation** :
  - `name` : chaîne non vide, sinon `400 "Le nom de la tâche doit être un champ de caractère"`
  - `assignment` : requis, converti en entier, sinon `400 "Un membre doit être assigné à la tâche"` (absent) ou `400 "L'identifiant du membre assigné doit être un nombre entier"` (non convertible)
  - `points` : nombre strictement supérieur à 0, sinon `400 "La variable point est de type number et être strictement supérieur à zéro"`
- **Réponse** : `201`, la tâche créée avec `assignedMember`.

### `PUT /api/tasks/:id`

Modifie une tâche. Réservé aux Admin.

- **Paramètre** : `id` — entier valide, sinon `400 "L'identifiant de la tâche n'est pas valide !"`
- **Corps** : `{ name, description, status, points, user_id }`
- **Validation** :
  - `name` : chaîne non vide, sinon `400`
  - `description` : si fournie, doit être une chaîne, sinon `400`
  - `status` : requis, doit valoir `"A_FAIRE"` ou `"TERMINE"`, sinon `400`
  - `points` : si fourni, doit être un entier, sinon `400`
  - `user_id` : si fourni, doit être un entier, sinon `400`
- **Réponse succès** : `200`, la tâche mise à jour.
- **Erreur** : `404` si la tâche n'existe pas (levée par le service, pas par le controller).

> **Limite connue** : cette route ne vérifie que le rôle ADMIN — le contrôle "ADMIN ou membre assigné à la tâche" évoqué dans les spécifications n'est pas encore implémenté de bout en bout. Voir [Limites et dette](../explications/limites-et-dette.md).

### `DELETE /api/tasks/:id`

Supprime une tâche. Réservé aux Admin.

| Cas                          | Code HTTP           |
| ----------------------------- | -------------------- |
| Id invalide (pas un entier)   | `400`                |
| Tâche inexistante              | `404 "Ressource introuvable..."` |
| Suppression réussie            | `204` (sans corps)   |
| Erreur serveur imprévue        | `500`                |

## Format des erreurs

Toutes les erreurs passent par un middleware central (`back/src/middlewares/errorHandler.js`) et sont renvoyées au même format :

```json
{ "error": "message" }
```

- Le code HTTP est celui porté par l'erreur levée (`AppError(message, statusCode)`) dans les controllers/services.
- Pour toute erreur non anticipée (code `500`), le message précis n'est **jamais** renvoyé au client — le client reçoit `{ "error": "Erreur serveur" }`, le détail est uniquement journalisé côté serveur (`console.error`).

---

Le parcours complet d'une requête est décrit dans [Flux applicatifs](../explications/flux-applicatifs.md). Les limites connues (validation, sécurité) sont listées dans [Limites et dette](../explications/limites-et-dette.md).
