---
sidebar_position: 4
description: Pour l'équipe au quotidien. Répond à « quelles tables, quelles colonnes, quelles contraintes ? ».
---

# Base de données

**PostgreSQL**, sans ORM — les requêtes SQL sont écrites à la main dans les `models/` du backend (voir [ADR 001](../explications/adr/001-pas-d-orm.md)).

Pour créer ou réinitialiser la base : [Initialiser la base de données](../guides/initialiser-la-bdd.md).

## Fichiers

Dans `db/` :

| Fichier              | Rôle                                              |
| -------------------- | ----------------------------------------------- |
| `migration_up.sql`   | crée les tables et les types                     |
| `migration_down.sql` | annule la migration (supprime tables et types)   |
| `seed.sql`           | données de test                                 |
| `queries.sql`        | requêtes utiles pour explorer / vérifier         |

## Tables

Trois tables principales :

| Table         | Rôle                                                                                     |
| ------------- | ------------------------------------------------------------------------------------- |
| `users`       | membres de la famille (`role` : `ADMIN`/`MEMBER`, `tribe_name`, `password_hash`, points) |
| `tasks`       | tâches (`status` : `A_FAIRE`/`TERMINE`, points)                                        |
| `users_tasks` | table pivot : assigne une tâche à un utilisateur                                      |

`users_tasks` fait le lien many-to-many entre `users` et `tasks`, avec `ON DELETE CASCADE` : supprimer un utilisateur ou une tâche supprime automatiquement les assignations liées.

## Types énumérés

Deux `ENUM` contraignent les valeurs possibles :

- `status` : `A_FAIRE` | `TERMINE`
- `role` : `ADMIN` | `MEMBER`

## Points connus

La colonne `total_points` de `users` existe mais n'est pas incrémentée côté backend à la validation d'une tâche — voir [Limites et dette](../explications/limites-et-dette.md).
