---
sidebar_position: 1
---

# Vue d'ensemble du projet

**Lovelace Family** est une application de gestion de tâches entre membres d'une famille, pensée pour être fun et gamifiée afin de donner envie de participer. Elle s'adresse aux parents et à leurs enfants.

## Fonctionnalités principales (V1)

- 🔐 Connexion
- ➕ Création de tâche
- 👤 Assignation de tâche
- 👁️ Visualisation des tâches
- ✅ Validation des tâches
- ✏️ Modification des tâches
- 🗑️ Suppression de tâche
- 🚪 Déconnexion
- 🏆 Gamification (points, progression, célébration)

## Stack technique

- **Frontend** : React + Vite
- **Backend** : Node.js / Express, organisé en couches (routes → controllers → services → models)
- **Base de données** : PostgreSQL, sans ORM
- **Orchestration** : Docker Compose

## Flux principaux

La section Back-end détaille trois flux type, du frontend jusqu'à la base de données, ainsi que leurs axes d'amélioration :

- **Création d'une tâche** — création puis assignation à un membre
- **Consultation des tâches** — récupération de toutes les tâches ou de celles d'un utilisateur, déjà triées par statut
- **Suppression d'une tâche** — confirmation utilisateur puis suppression en base

## Pour aller plus loin

- [Installation](./installation/index.md) — lancer le projet en local
- [Architecture](./architecture/index.md) — comment les trois couches communiquent
- [Back-end](./back/index.md) — structure et flux de l'API
- [Front-end](./front/index.md) — structure des composants React
- [Base de données](./base-de-donnees/index.md) — schéma des tables
- [Contribution](./contribution/index.md) — conventions de branches et de Pull Requests
