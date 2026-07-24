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

## Exemple de flux : création d'une tâche

1. `POST /api/tasks` arrive sur `tasksRoutes.js`, aiguillé vers `createTaskController`
2. Le controller valide les champs (`name`, `assignment`, `points`) et renvoie une erreur 400 si besoin
3. `createTaskServices` crée la tâche (`createTaskModel`) puis l'assigne à un membre (`createTaskAssignedUserModel`) dans la table pivot `users_tasks`
4. Le controller renvoie la tâche créée avec le code 201

## Exemple de flux : suppression d'une tâche

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

> ⚠️ **Limitation connue** : il n'y a aujourd'hui aucune vérification d'authentification ou de rôle côté serveur sur cet endpoint. Le bouton de suppression n'est affiché côté frontend que pour un `ADMIN`, mais ce contrôle d'accès est un confort d'UX, pas une sécurité — n'importe qui connaissant l'URL et l'id peut supprimer une tâche via une requête HTTP directe. À corriger avant mise en production.

## Connexion à la base de données

`back/src/models/configDb.js` crée un `Pool` PostgreSQL unique à partir des variables d'environnement (`POSTGRES_USER`, `POSTGRES_HOST`, etc. — voir [Installation](../installation/index.md)), réutilisé par tous les models de l'application.

## Démarrer / déboguer en local

Voir la section [Installation](../installation/index.md) pour lancer le backend via Docker Compose (port `5000`, inspecteur Node sur `9229`).
