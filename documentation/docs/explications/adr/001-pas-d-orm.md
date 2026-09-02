---
sidebar_position: 2
description: "Décision : requêtes SQL brutes via pg, sans ORM."
---

# 001 — Pas d'ORM

**Statut** : en vigueur

## Contexte

Le backend doit accéder à PostgreSQL. Le choix se pose entre un ORM (Sequelize, Prisma, TypeORM) et un client bas niveau (`pg`) avec du SQL écrit à la main.

## Décision

Requêtes SQL brutes via `pg`, dans les `models/`. Pas d'ORM.

## Raisons

- Projet pédagogique : écrire le SQL rend visible ce qui se passe réellement en base.
- Schéma simple (trois tables), pas besoin de migrations complexes ni de relations lourdes.
- Une dépendance de moins, pas de couche d'abstraction à apprendre.

## Alternatives écartées

- **Prisma / Sequelize** — gain de productivité sur de gros schémas, mais masque le SQL et ajoute une étape de génération / migration.

## Conséquences

- Chaque requête est explicite et optimisable à la main.
- La protection contre l'injection SQL repose entièrement sur l'usage systématique des requêtes paramétrées (`$1`, `$2`…).
- Pas de typage automatique des résultats.
