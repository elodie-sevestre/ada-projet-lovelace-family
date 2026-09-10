---
sidebar_position: 1
description: Pour l'équipe au quotidien. Répond à « quel endpoint, quel corps de requête, quel code retour ? ».
---

# API HTTP

Base : `http://localhost:5000`. Le frontend appelle l'API via `front/src/api/client.js` (base actuellement codée en dur `http://localhost:5000/api` — voir [ADR 003](../explications/adr/003-url-api-en-dur.md)).

Trois groupes de routes, montés dans `back/src/server.js` :

| Préfixe      | Fichier de routes            | Protection                     |
| ------------ | ----------------------------- | ------------------------------- |
| `/auth`      | `routes/loginRoutes.js`       | public                          |
| `/api/users` | `routes/usersRoutes.js`       | `requireAuth` (toutes les routes) |
| `/api/tasks` | `routes/tasksRoutes.js`       | `requireAuth` + rôle selon la route |

## En-têtes

| En-tête         | Valeur                  | Requis pour |
| ---------------- | ------------------------ | ----------- |
| `Content-Type`    | `application/json`       | toute requête avec un corps (`POST`, `PUT`) — le backend utilise `express.json()`, sans cet en-tête le corps n'est pas parsé |
| `Authorization`   | `Bearer <token>`          | toutes les routes sous `/api/users` et `/api/tasks` |

Réponses toujours au format JSON, sauf `204` (sans corps).

## Authentification

### POST /auth/inscription

Crée un nouvel utilisateur. Pas d'en-tête `Authorization` requis.

```
createLoginController → createLoginService → createLoginModel
```

**Requête**

```json
{
  "role": "MEMBER",
  "name": "Léa",
  "mail": "lillychat@gmail.com",
  "tribe_name": "Famille Dupont",
  "password": "kawai3000"
}
```

**Validation**

| Champ | Obligatoire | Validé dans le controller |
| ----- | :---------: | :------------------------: |
| name | oui | non — juste présence |
| mail | oui | non — juste présence |
| password | oui | non — juste présence |
| role | non | non |
| tribe_name | non | non |

Champ obligatoire absent → `400 "Champs requis manquants"`.

- **Réponse succès** : `204` — **sans corps**. Le hash du mot de passe n'est jamais renvoyé.
- **Erreurs** :
  - `400` — champ requis manquant
  - `409 "Inscription impossible"` — email déjà utilisé (contrainte unique en base, code Postgres `23505`)

Le mot de passe est haché avec bcryptjs (`bcrypt.hash(password, 10)`) avant stockage.

### POST /auth/connexion

Authentifie un utilisateur. Pas d'en-tête `Authorization` requis (c'est cette route qui le fournit).

```
connexionController → connexionService → findUserByEmail (models/loginModels.js)
```

**Requête**

```json
{
  "mail": "bernard@aol.com",
  "password": "lemotdepasse"
}
```

**Validation, dans l'ordre**

| Ordre | Règle | Sinon |
| :---: | ----- | ----- |
| 1 | mail et password présents | `400 "Email et mot de passe requis"` |
| 2 | mail au format email (regex) | `400 "Format Email invalide"` |
| 3 | password ≥ 8 caractères | `400 "Format password invalide"` |

**Réponse succès — `200`**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJBRE1JTiJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

- **Erreur** : `401 "Identifiants invalides"` — email inconnu **ou** mot de passe incorrect (le message ne précise pas lequel des deux).

Le token est un JWT signé, valide 3 heures (`expiresIn: '3h'`), avec pour payload `{ userId, role }`. Il est stocké dans le `localStorage` côté frontend (voir [ADR 002](../explications/adr/002-jwt-localstorage.md)).

### Protection des routes /api/*

Toutes les routes sous `/api/users` et `/api/tasks` exigent l'en-tête `Authorization: Bearer <token>`.

| Cas | Code |
| --- | ---- |
| En-tête absent ou mal formé | `401 "Token manquant"` |
| Token invalide ou expiré | `401 "Token invalide ou expiré"` |
| Rôle du token ≠ rôle attendu par la route | `404 "Not found"` |

Rôles possibles (`back/src/constants.js`) : `ADMIN`, `MEMBER`.

Le mécanisme (middlewares `requireAuth`/`checkRole`, pourquoi `404` plutôt que `403`) est décrit dans [Authentification et autorisation](../explications/authentification.md).

## Routes /api/users

| Méthode | Endpoint | Controller              | Service               | Model                | Rôle requis |
| ------- | -------- | ------------------------ | ----------------------- | ----------------------- | ----------- |
| GET     | `/`      | `getAllUsersController`  | `getAllUsersService`   | `getAllUsersModel`     | aucun (juste authentifié) |

### GET /api/users

**En-têtes** : `Authorization: Bearer <token>`

**Réponse succès — `200`**

```json
[
  { "id": 1, "name": "Bernard", "role": "ADMIN", "total_points": 120 },
  { "id": 2, "name": "Léa", "role": "MEMBER", "total_points": 45 }
]
```

La requête SQL sélectionne explicitement `id, name, role, total_points` — le hash du mot de passe et l'email ne sont jamais renvoyés.

> **⚠️ Écart avec les notes précédentes du projet** : il avait été question d'une route `GET /api/users/:id` réservée au rôle Admin. Elle n'existe pas dans `usersRoutes.js` sur `develop` au moment de la rédaction de cette page — seule la route `/` ci-dessus existe.

## Routes /api/tasks

| Méthode | Endpoint     | Controller                  | Service                  | Model(s)                                              | Rôle requis |
| ------- | ------------ | ---------------------------- | --------------------------- | -------------------------------------------------------- | ----------- |
| GET     | `/`          | `getAllTasksController`      | `getAllTasksService`      | `getAllTasksModel`                                       | ADMIN       |
| GET     | `/users`     | `getTasksByUserController`   | `getTasksByUserService`   | `getTasksByUserModel`                                    | aucun *(voir note)* |
| GET     | `/users/:id` | `getTasksByUserIdController` | `getTasksByUserService`   | `getTasksByUserModel`                                    | ADMIN       |
| POST    | `/`          | `createTaskController`       | `createTaskServices`      | `createTaskModel` + `createTaskAssignedUserModel`         | ADMIN       |
| PUT     | `/:id`       | `updateTaskController`       | `updateTaskService`       | `updateTaskDetailsModel` + `updateTaskAssignedUserModel`  | ADMIN       |
| DELETE  | `/:id`       | `deleteTaskController`       | `deleteTaskService`       | `deleteTaskModel`                                         | ADMIN       |

> **Note sur `GET /users`** : la vérification de rôle est présente dans le code mais **commentée** (`// createCheckRoleMiddleware(ROLE.Member)`) — la route est donc accessible à n'importe quel utilisateur authentifié, Admin ou Member, pour l'instant.

> **⚠️ Piège de nommage** : les routes `GET` renvoient le nom de la tâche sous la clé **`task_name`** (alias SQL), alors que `POST` et `PUT` le renvoient sous la clé **`name`** (colonne brute de la table). Les deux routes `GET` liées aux tâches d'un utilisateur (`/users` et `/users/:id`) ne renvoient pas non plus le champ `description`, contrairement à `GET /` — seule la requête SQL de `getAllTasksModel` le sélectionne.

### GET /api/tasks

Toutes les tâches, tous utilisateurs confondus.

**En-têtes** : `Authorization: Bearer <token>` (rôle ADMIN)

**Réponse succès — `200`**

```json
{
  "toDoTasks": [
    {
      "id": 3,
      "task_name": "Ranger sa chambre",
      "description": "Ranger les jouets et faire le lit",
      "points": 10,
      "status": "A_FAIRE",
      "created_at": "2026-09-01T08:00:00.000Z",
      "updated_at": "2026-09-01T08:00:00.000Z",
      "assigned_to": "Léa",
      "assigned_user_ids": [2]
    }
  ],
  "finishedTasks": [
    {
      "id": 1,
      "task_name": "Mettre la table",
      "description": "Pour le dîner",
      "points": 5,
      "status": "TERMINE",
      "created_at": "2026-08-28T18:00:00.000Z",
      "updated_at": "2026-08-28T18:45:00.000Z",
      "assigned_to": "Léa",
      "assigned_user_ids": [2]
    }
  ]
}
```

Deux tableaux, découpés côté service selon le champ `status`.

### GET /api/tasks/users

Les tâches de l'utilisateur **actuellement connecté** — l'id est lu depuis le token (`req.user.userId`), pas depuis l'URL.

**En-têtes** : `Authorization: Bearer <token>`

**Réponse succès — `200`**

```json
{
  "toDoTasks": [
    {
      "id": 3,
      "task_name": "Ranger sa chambre",
      "points": 10,
      "status": "A_FAIRE",
      "created_at": "2026-09-01T08:00:00.000Z",
      "updated_at": "2026-09-01T08:00:00.000Z",
      "assigned_to": "Léa",
      "assigned_user_ids": [2]
    }
  ],
  "finishedTasks": []
}
```

### GET /api/tasks/users/:id

Les tâches d'un utilisateur donné par son id — réservé aux Admin.

**En-têtes** : `Authorization: Bearer <token>` (rôle ADMIN)

- **Paramètre** : `id` — doit être un nombre, sinon `400 "L'id de l'utilisateur doit être un nombre valide."`
- **Réponse succès — `200`** : même forme que `GET /api/tasks/users` ci-dessus, pour l'utilisateur ciblé.

### POST /api/tasks

Crée une tâche. Réservé aux Admin.

**En-têtes** : `Content-Type: application/json`, `Authorization: Bearer <token>` (rôle ADMIN)

**Requête**

```json
{
  "name": "Sortir la poubelle",
  "description": "Poubelles jaune et noire",
  "assignment": 2,
  "points": 5
}
```

- **Validation** :
  - `name` : chaîne non vide, sinon `400 "Le nom de la tâche doit être un champ de caractère"`
  - `assignment` : requis, converti en entier, sinon `400 "Un membre doit être assigné à la tâche"` (absent) ou `400 "L'identifiant du membre assigné doit être un nombre entier"` (non convertible)
  - `points` : nombre strictement supérieur à 0, sinon `400 "La variable point est de type number et être strictement supérieur à zéro"`

**Réponse succès — `201`**

```json
{
  "id": 8,
  "name": "Sortir la poubelle",
  "description": "Poubelles jaune et noire",
  "status": "A_FAIRE",
  "points": 5,
  "created_at": "2026-09-10T14:32:00.000Z",
  "updated_at": "2026-09-10T14:32:00.000Z",
  "assignedMember": 2
}
```

### PUT /api/tasks/:id

Modifie une tâche. Réservé aux Admin.

**En-têtes** : `Content-Type: application/json`, `Authorization: Bearer <token>` (rôle ADMIN)

**Requête**

```json
{
  "name": "Sortir la poubelle",
  "description": "Poubelles jaune et noire, avant 20h",
  "status": "TERMINE",
  "points": 5,
  "user_id": 2
}
```

- **Paramètre** : `id` — entier valide, sinon `400 "L'identifiant de la tâche n'est pas valide !"`
- **Validation** :
  - `name` : chaîne non vide, sinon `400`
  - `description` : si fournie, doit être une chaîne, sinon `400`
  - `status` : requis, doit valoir `"A_FAIRE"` ou `"TERMINE"`, sinon `400`
  - `points` : si fourni, doit être un entier, sinon `400`
  - `user_id` : si fourni, doit être un entier, sinon `400`

**Réponse succès — `200`**

```json
{
  "id": 8,
  "name": "Sortir la poubelle",
  "description": "Poubelles jaune et noire, avant 20h",
  "status": "TERMINE",
  "points": 5,
  "created_at": "2026-09-10T14:32:00.000Z",
  "updated_at": "2026-09-10T15:10:00.000Z"
}
```

- **Erreur** : `404` si la tâche n'existe pas (levée par le service, pas par le controller).

> **Limite connue** : cette route ne vérifie que le rôle ADMIN — le contrôle "ADMIN ou membre assigné à la tâche" évoqué dans les spécifications n'est pas encore implémenté de bout en bout. Voir [Limites et dette](../explications/limites-et-dette.md).

### DELETE /api/tasks/:id

Supprime une tâche. Réservé aux Admin.

**En-têtes** : `Authorization: Bearer <token>` (rôle ADMIN)

| Cas                          | Code HTTP           |
| ----------------------------- | -------------------- |
| Id invalide (pas un entier)   | `400`                |
| Tâche inexistante              | `404 "Ressource introuvable..."` |
| Suppression réussie            | `204` (sans corps)   |
| Erreur serveur imprévue        | `500`                |

## Format des erreurs

Toute erreur est renvoyée au même format :

```json
{ "error": "message" }
```

Le code HTTP varie selon l'erreur — voir le détail par endpoint ci-dessus. Le fonctionnement du mécanisme (middleware, `AppError`, masquage des erreurs 500) est décrit dans [Gestion centralisée des erreurs](../explications/gestion-erreurs.md).

---

Le parcours complet d'une requête est décrit dans [Flux applicatifs](../explications/flux-applicatifs.md). Les limites connues (validation, sécurité) sont listées dans [Limites et dette](../explications/limites-et-dette.md).