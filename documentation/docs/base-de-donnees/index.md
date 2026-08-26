# Base de données

**PostgreSQL**, sans ORM — les requêtes SQL sont écrites à la main dans les `models/` du backend.

## Fichiers

Dans `db/` :

- **`migration_up.sql`** : crée les tables et types (à jouer pour initialiser la BDD)
- **`migration_down.sql`** : annule la migration (supprime tables/types)
- **`seed.sql`** : données de test à insérer après la migration
- **`queries.sql`** : requêtes utiles pour explorer/vérifier les données manuellement

## Schéma

Trois tables principales :

| Table         | Rôle                                                                                    |
| ------------- | --------------------------------------------------------------------------------------- |
| `users`       | membres de la famille (`role`: `ADMIN`/`MEMBER`, `tribe_name`, `password_hash`, points) |
| `tasks`       | tâches (`status`: `A_FAIRE`/`TERMINE`, points)                                          |
| `users_tasks` | table pivot : assigne une tâche à un utilisateur                                        |

`users_tasks` fait le lien many-to-many entre `users` et `tasks`, avec `ON DELETE CASCADE` : supprimer un utilisateur ou une tâche supprime automatiquement les assignations liées.

Deux types énumérés (`ENUM`) contraignent les valeurs possibles :

- `status` : `A_FAIRE` | `TERMINE`
- `role` : `ADMIN` | `MEMBER`
