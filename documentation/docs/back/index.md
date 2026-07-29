# Back-end

Stack : **Node.js / Express**, requêtes SQL brutes via le package `pg` (pas d'ORM).

## Structure

```
back/src/
├── server.js          # point d'entrée : configure Express, CORS, monte les routes
├── routes/            # définit les endpoints HTTP
├── controllers/       # valide les entrées, appelle un service, renvoie la réponse HTTP
├── services/          # logique métier
└── models/            # requêtes SQL (via pg)
```

## Route `/api/users`

`GET /api/users` renvoie désormais la liste réelle des utilisateurs (`getAllUsersController` → `getAllUsersService` → `getAllUsersModel`, un simple `SELECT * FROM users`).

## Authentification

Un module d'authentification existe côté backend, monté sur `/auth` (et non `/api`) :

- `POST /auth/inscription` — crée un utilisateur, hash le mot de passe avec `bcrypt` avant de l'enregistrer (colonne `password_hash`)
- `POST /auth/connexion` — vérifie l'email/mot de passe, renvoie un token JWT (`{ userId, role }`, signé avec `JWT_SECRET`, expire après 24h)

Un middleware `requireAuth` (`back/src/middlewares/requireAuth.js`) est prêt à protéger des routes : il vérifie l'en-tête `Authorization: Bearer <token>` et rejette avec un `401` si le token est absent, invalide ou expiré.

### Axes d'amélioration

- Le middleware `requireAuth` n'est branché sur aucune route pour l'instant — ni `/api/tasks`, ni `/api/users`. L'authentification existe mais ne protège encore rien concrètement.
- Aucune interface de connexion côté frontend : `TasksConsultation.jsx` utilise toujours un utilisateur codé en dur (`{ role: "ADMIN" }`). La fonctionnalité reste backend-only pour l'instant.

## Tests

Le backend a des tests unitaires avec **Jest**, dans `back/tests/` :

- `tasksControllers.test.js`
- `updateTaskController.test.js`

```bash
cd back
npm test
```

Ces tests mockent la couche `services` (`jest.unstable_mockModule`) plutôt que d'appeler la vraie base de données : on vérifie que le controller renvoie le bon code HTTP et le bon corps de réponse pour un service donné, sans dépendre de PostgreSQL.

> Le frontend n'a pas encore de tests automatisés à ce jour.

## Flux : création d'une tâche

1. `POST /api/tasks` arrive sur `tasksRoutes.js`, aiguillé vers `createTaskController`
2. Le controller valide les champs (`name`, `assignment`, `points`) et renvoie une erreur 400 si besoin
3. `createTaskServices` crée la tâche (`createTaskModel`) puis l'assigne à un membre (`createTaskAssignedUserModel`) dans la table pivot `users_tasks`
4. Le controller renvoie la tâche créée avec le code 201

### Axes d'amélioration

- Le `catch` de `createTaskController` renvoie systématiquement un code `400`, y compris pour des erreurs techniques imprévues (ex: base de données injoignable). Ces cas devraient renvoyer un `500`, comme le fait déjà `updateTaskController`.

## Flux : consultation des tâches

Deux endpoints permettent de consulter les tâches :

- `GET /api/tasks` → toutes les tâches (`getAllTasksController`)
- `GET /api/tasks/users/:id` → les tâches d'un utilisateur donné (`getTasksByUserController`)

Dans les deux cas, le service ne renvoie pas une simple liste mais un objet `{ toDoTasks, finishedTasks }` : le tri par statut est fait côté backend avec `filter`, pour que le frontend n'ait qu'à afficher deux listes déjà prêtes :

```js
const toDoTasks = tasks.filter((task) => task.status === "A_FAIRE");
const finishedTasks = tasks.filter((task) => task.status === "TERMINE");
```

### Axes d'amélioration

- L'id utilisateur reçu par `getTasksByUserController` (`req.params.id`) n'est pas validé avant d'être transmis au service, contrairement à `updateTaskController`/`deleteTaskController` qui vérifient que l'id est un entier. Un id non numérique provoquerait une erreur SQL renvoyée en `500` générique plutôt qu'un `400` explicite.
- Les erreurs sont renvoyées avec un message générique (`"Erreur lors de la récupération des tâches"`), sans distinguer les causes possibles.

## Flux : suppression d'une tâche

`DELETE /api/tasks/:id` suit le même découpage en couches (route → controller → service → model), avec des codes HTTP différenciés selon le résultat :

| Cas                         | Code HTTP                     |
| --------------------------- | ----------------------------- |
| Id invalide (pas un entier) | `400`                         |
| Tâche inexistante           | `404`                         |
| Suppression réussie         | `204` (sans corps de réponse) |
| Erreur serveur imprévue     | `500`                         |

Le modèle utilise une requête paramétrée avec `RETURNING *` pour savoir si une ligne a réellement été supprimée, sans `SELECT` préalable :

```sql
DELETE FROM tasks WHERE id=$1 RETURNING *
```

### Axes d'amélioration

- **Aucune vérification d'authentification ou de rôle côté serveur** sur cet endpoint — le middleware `requireAuth` existe (voir [Authentification](#authentification)) mais n'y est pas encore appliqué. Le bouton de suppression n'est affiché côté frontend que pour un `ADMIN`, mais ce contrôle d'accès est un confort d'UX, pas une sécurité — n'importe qui connaissant l'URL et l'id peut supprimer une tâche via une requête HTTP directe.
- Pas de test automatisé pour cet endpoint, contrairement à `updateTaskController` qui a `back/tests/updateTaskController.test.js`.

## Connexion à la base de données

`back/src/models/configDb.js` crée un `Pool` PostgreSQL unique à partir des variables d'environnement (`POSTGRES_USER`, `POSTGRES_HOST`, etc. — voir [Installation](../installation/index.md)), réutilisé par tous les models de l'application.

## Démarrer / déboguer en local

Voir la section [Installation](../installation/index.md) pour lancer le backend via Docker Compose (port `5000`, inspecteur Node sur `9229`).
