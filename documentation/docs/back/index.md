# Back-end

Stack : **Node.js / Express**, requêtes SQL brutes via le package `pg` (pas d'ORM).

## Structure

```
back/src/
├── server.js          # point d'entrée : configure Express, CORS, monte les routes
├── routes/            # définit les endpoints HTTP
├── controllers/       # valide les entrées, appelle un service, renvoie la réponse HTTP
├── services/          # logique métier
├── models/            # requêtes SQL (via pg)
├── middlewares/       # middlewares Express (authentification, etc.)
└── config/            # configuration (variables d'environnement)
```

## Authentification

### Endpoints publics (sans token requis)

- `POST /auth/inscription` — crée un nouvel utilisateur
  - Corps : `{ mail, password, name, tribe_name }`
  - Réponse : `{ userId, role, message }`
  - Le mot de passe est hashé avec `bcryptjs` avant d'être stocké en base

- `POST /auth/connexion` — authentifie un utilisateur et renvoie un token JWT
  - Corps : `{ mail, password }`
  - Réponse : `{ token }` — token JWT valide 24h, contient `{ userId, role }`
  - Stocké en localStorage côté frontend

### Endpoints protégés (token requis)

Tous les endpoints sous `/api/tasks` et `/api/users` sont protégés par le middleware `requireAuth`.

Le middleware vérifie l'en-tête `Authorization: Bearer ` :

- ✅ Si le token est valide et non expiré, la requête continue
- ❌ Si absent, invalide ou expiré, répond avec un `401 Unauthorized`

**Fichier** : `back/src/middlewares/requireAuth.js`

## Routes de l'API

### `/auth` — Authentification (publique)

| Méthode | Endpoint       | Controller            | Validation                       |
| ------- | -------------- | --------------------- | -------------------------------- |
| POST    | `/inscription` | createLoginController | mail, password, name, tribe_name |
| POST    | `/connexion`   | connexionController   | mail, password                   |

### `/api/users` — Utilisateurs (protégée)

| Méthode | Endpoint | Controller            | Rôle requis |
| ------- | -------- | --------------------- | ----------- |
| GET     | `/`      | getAllUsersController | N/A         |

Renvoie la liste de tous les utilisateurs de la tribu (sans les mots de passe hashés).

### `/api/tasks` — Tâches (protégée)

| Méthode | Endpoint     | Controller               | Rôle requis      |
| ------- | ------------ | ------------------------ | ---------------- |
| GET     | `/`          | getAllTasksController    | N/A              |
| GET     | `/users/:id` | getTasksByUserController | N/A              |
| POST    | `/`          | createTaskController     | ADMIN            |
| PUT     | `/:id`       | updateTaskController     | ADMIN ou assigné |
| DELETE  | `/:id`       | deleteTaskController     | ADMIN            |

## Tests

Le backend a des tests unitaires avec **Jest**, dans `back/tests/` :

- `createTaskController.test.js`
- `updateTaskController.test.js`

```bash
cd back
npm test
```

Ces tests mockent la couche `services` plutôt que d'appeler la vraie base de données.

> Le frontend n'a pas encore de tests automatisés.

## Flux : création d'une tâche

1. `POST /api/tasks` arrive sur `tasksRoutes.js`, aiguillé vers `createTaskController`
2. Le middleware `requireAuth` vérifie le token
3. Le controller valide les champs (`name`, `assignment`, `points`)
4. `createTaskServices` crée la tâche puis l'assigne en table pivot `users_tasks`
5. Le controller renvoie la tâche créée avec le code 201

## Flux : consultation des tâches

Deux endpoints permettent de consulter les tâches :

- `GET /api/tasks` → toutes les tâches
- `GET /api/tasks/users/:id` → les tâches d'un utilisateur donné

Le service retourne un objet `{ toDoTasks, finishedTasks }` : le tri par statut est déjà fait côté backend.

## Flux : modification d'une tâche (changement de statut via checkbox)

`PUT /api/tasks/:id` permet de modifier une tâche, notamment son statut :

1. `TaskCheckBox.jsx` au front envoie `{ status: "TERMINE" | "A_FAIRE", name, description, points }`
2. Le middleware `requireAuth` vérifie le token
3. `updateTaskController` valide l'id et les champs
4. `updateTaskServices` exécute la mise à jour
5. Réponse 200 avec la tâche modifiée

## Flux : suppression d'une tâche

`DELETE /api/tasks/:id` supprime une tâche et toutes ses assignations (cascade).

| Cas                         | Code HTTP                     |
| --------------------------- | ----------------------------- |
| Id invalide (pas un entier) | `400`                         |
| Tâche inexistante           | `404`                         |
| Suppression réussie         | `204` (sans corps de réponse) |
| Erreur serveur imprévue     | `500`                         |

## Axes d'amélioration

- **Contrôle d'accès granulaire** : seul un ADMIN ou l'utilisateur assigné devrait pouvoir modifier/valider une tâche. Actuellement, n'importe qui avec un token valide peut le faire.
- **Validation de l'id utilisateur** : dans `getTasksByUserController`, l'id n'est pas validé avant d'être passé au service (contrairement à `updateTaskController`/`deleteTaskController`).
- **Tests du endpoint DELETE** : pas de test automatisé pour cet endpoint contrairement aux autres.
- **Gestion d'erreurs unifiée** : les erreurs sont renvoyées avec un message générique, sans distinction des causes possibles.
- **Refresh du token** : le token JWT n'expire jamais utilisateur-side — ajouter un mécanisme de refresh serait un plus.

## Connexion à la base de données

`back/src/models/configDb.js` crée un `Pool` PostgreSQL unique à partir des variables d'environnement (`POSTGRES_USER`, `POSTGRES_HOST`, etc.), réutilisé par tous les models.

## Démarrer / déboguer en local

Voir la section [Installation](../installation/index.md) pour lancer le backend via Docker Compose (port `5000`, inspecteur Node sur `9229`).
