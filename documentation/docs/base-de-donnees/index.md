# Base de données

Stack : **PostgreSQL**, sans ORM. Scripts SQL bruts dans `db/` (`migration_up.sql`, `migration_down.sql`, `seed.sql`, `queries.sql`).

## Types énumérés

```sql
CREATE TYPE "status" AS ENUM ('A_FAIRE', 'TERMINE');
CREATE TYPE "role" AS ENUM ('ADMIN', 'MEMBER');
```

## Tables

### `users`

| Colonne         | Type         | Contrainte                  |
| --------------- | ------------ | --------------------------- |
| `id`            | INTEGER      | PK, auto-généré             |
| `role`          | ROLE         | NOT NULL (`ADMIN`/`MEMBER`) |
| `name`          | VARCHAR(255) | NOT NULL                    |
| `mail`          | VARCHAR(255) | NOT NULL                    |
| `tribe_name`    | VARCHAR(255) | NOT NULL                    |
| `password_hash` | VARCHAR(255) | NOT NULL                    |
| `total_points`  | INTEGER      |                             |
| `created_at`    | TIMESTAMP    | NOT NULL, défaut `NOW()`    |
| `updated_at`    | TIMESTAMP    | NOT NULL, défaut `NOW()`    |

### `tasks`

| Colonne       | Type         | Contrainte                     |
| ------------- | ------------ | ------------------------------ |
| `id`          | INTEGER      | PK, auto-généré                |
| `name`        | VARCHAR(255) | NOT NULL                       |
| `description` | VARCHAR(255) |                                |
| `status`      | STATUS       | NOT NULL (`A_FAIRE`/`TERMINE`) |
| `points`      | INTEGER      |                                |
| `created_at`  | TIMESTAMP    | NOT NULL, défaut `NOW()`       |
| `updated_at`  | TIMESTAMP    | NOT NULL, défaut `NOW()`       |

### `users_tasks` (table pivot)

| Colonne   | Type    | Contrainte                                     |
| --------- | ------- | ---------------------------------------------- |
| `id`      | INTEGER | PK, auto-généré                                |
| `user_id` | INTEGER | NOT NULL, FK → `users.id`, `ON DELETE CASCADE` |
| `task_id` | INTEGER | NOT NULL, FK → `tasks.id`, `ON DELETE CASCADE` |

Une tâche peut être assignée à un ou plusieurs membres via cette table de liaison ; la suppression d'un user ou d'une task supprime automatiquement les lignes d'assignation correspondantes (cascade).

## Données de test (`seed.sql`)

- 2 users : un `ADMIN` (Bernard) et un `MEMBER` (Léa), même `tribe_name`
- 5 tasks avec différents statuts et points
- Assignations dans `users_tasks` reliant chaque user à plusieurs tâches

## Migrations

`back/src/scripts/migration_up.js` et `migration_down.js` exécutent respectivement `db/migration_up.sql` (création des types/tables) et `db/migration_down.sql` (rollback).
