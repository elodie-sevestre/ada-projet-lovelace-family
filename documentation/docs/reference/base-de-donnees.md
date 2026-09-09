---
sidebar_position: 4
description: Pour l'équipe au quotidien. Répond à « quelles tables, quelles colonnes, quelles contraintes ? ».
---

# Base de données

**PostgreSQL**, sans ORM — les requêtes SQL sont écrites à la main dans les `models/` du backend (voir [ADR 001](../explications/adr/001-pas-d-orm.md)).

Le schéma fait foi dans `db/migration_up.sql`. Pour créer ou réinitialiser la base : [Initialiser la base de données](../guides/initialiser-la-bdd.md).

## Fichiers

Dans `db/` :

| Fichier              | Rôle                                           |
| -------------------- | ---------------------------------------------- |
| `migration_up.sql`   | crée les tables et les types                   |
| `migration_down.sql` | annule la migration (supprime tables et types) |
| `seed.sql`           | données de test                                |
| `queries.sql`        | requêtes utiles pour explorer / vérifier       |

## Types énumérés

| Type     | Valeurs                |
| -------- | ---------------------- |
| `status` | `A_FAIRE` \| `TERMINE` |
| `role`   | `ADMIN` \| `MEMBER`    |

## Table `users`

Membres de la famille.

| Colonne         | Type           | Contraintes                           |
| --------------- | -------------- | ------------------------------------- |
| `id`            | `INTEGER`      | clé primaire, `GENERATED AS IDENTITY` |
| `role`          | `role` (ENUM)  | `NOT NULL`                            |
| `name`          | `VARCHAR(255)` | `NOT NULL`                            |
| `mail`          | `VARCHAR(255)` | `NOT NULL`                            |
| `tribe_name`    | `VARCHAR(255)` | `NOT NULL`                            |
| `password_hash` | `VARCHAR(255)` | `NOT NULL`                            |
| `total_points`  | `INTEGER`      | nullable                              |
| `created_at`    | `TIMESTAMP`    | `NOT NULL`, défaut `NOW()`            |
| `updated_at`    | `TIMESTAMP`    | `NOT NULL`, défaut `NOW()`            |

## Table `tasks`

Tâches.

| Colonne       | Type            | Contraintes                           |
| ------------- | --------------- | ------------------------------------- |
| `id`          | `INTEGER`       | clé primaire, `GENERATED AS IDENTITY` |
| `name`        | `VARCHAR(255)`  | `NOT NULL`                            |
| `description` | `VARCHAR(255)`  | nullable                              |
| `status`      | `status` (ENUM) | `NOT NULL`                            |
| `points`      | `INTEGER`       | nullable                              |
| `created_at`  | `TIMESTAMP`     | `NOT NULL`, défaut `NOW()`            |
| `updated_at`  | `TIMESTAMP`     | `NOT NULL`, défaut `NOW()`            |

## Table `users_tasks`

Table pivot : lien many-to-many entre `users` et `tasks`.

| Colonne   | Type      | Contraintes                                                  |
| --------- | --------- | ------------------------------------------------------------ |
| `id`      | `INTEGER` | clé primaire, `GENERATED AS IDENTITY`                        |
| `user_id` | `INTEGER` | `NOT NULL`, clé étrangère → `users(id)`, `ON DELETE CASCADE` |
| `task_id` | `INTEGER` | `NOT NULL`, clé étrangère → `tasks(id)`, `ON DELETE CASCADE` |

Supprimer un utilisateur ou une tâche supprime automatiquement les lignes d'assignation correspondantes.

## Points connus

`total_points` (`users`) existe mais n'est pas incrémentée à la validation d'une tâche — voir [Limites et dette](../explications/limites-et-dette.md).
