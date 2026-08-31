---
sidebar_position: 2
description: Pour la dev qui doit créer ou réinitialiser la base. Répond à « comment je joue le schéma et le seed ? ».
---

# Initialiser la base de données

Le conteneur `postgres` démarre avec une base vide (`lovelace_db`). Il faut y jouer le schéma puis, si besoin, les données de test.

Les scripts SQL sont dans `db/` :

| Fichier              | Rôle                                                       |
| -------------------- | -------------------------------------------------------- |
| `migration_up.sql`   | crée les tables et les types — à jouer en premier        |
| `migration_down.sql` | annule la migration (supprime tables et types)           |
| `seed.sql`           | données de test, à insérer après la migration            |
| `queries.sql`        | requêtes utiles pour explorer / vérifier les données     |

## Option A — extension PostgreSQL de VS Code

Installe une extension type *PostgreSQL* (Chris Kolkman ou Weijan Chen), connecte-toi à `localhost:5432` avec les identifiants du `.env`, puis exécute `migration_up.sql` et `seed.sql` depuis l'éditeur.

## Option B — `psql` dans le conteneur

Les services étant démarrés ([Lancer le projet en local](./lancer-le-projet-en-local.md)) :

```bash
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d lovelace_db < db/migration_up.sql
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d lovelace_db < db/seed.sql
```

Remplace `$POSTGRES_USER` par la valeur de ton `.env` si ton shell ne la connaît pas.

Tu peux aussi passer par **Docker Desktop → conteneur `postgres` → onglet Exec** :

```bash
psql -U id_user -d lovelace_db
```

puis coller le contenu des fichiers `.sql`.

## Repartir de zéro

```bash
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d lovelace_db < db/migration_down.sql
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d lovelace_db < db/migration_up.sql
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d lovelace_db < db/seed.sql
```

## Utilisateurs de test

Le seed pré-charge deux comptes de démonstration, pour tester sans passer par une inscription :

| Persona     | Rôle   | Email               | Mot de passe |
| ----------- | ------ | ------------------- | ------------ |
| **Bernard** | ADMIN  | bernard@aol.com     | lemotdepasse |
| **Léa**     | MEMBER | lillychat@gmail.com | kawai3000    |

> Ces valeurs sont indicatives : elles font foi dans `db/seed.sql`. Vérifie-les si la connexion échoue.

Le schéma produit est décrit dans [Référence — Base de données](../reference/base-de-donnees.md).
