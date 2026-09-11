---
sidebar_position: 0
description: Présentation du projet et de la documentation ».
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
- 🏆 Gamification (célébration à la validation)

## Stack technique

- **Frontend** : React + Vite
- **Backend** : Node.js / Express, organisé en couches (routes → controllers → services → models)
- **Base de données** : PostgreSQL, sans ORM
- **Orchestration** : Docker Compose

## Gestion du projet
Retrouve le suivi de l'avancée du projet sur Jira : [Clique ici](https://lovelacefamily.atlassian.net/jira/software/projects/OLC/boards/1?filter=&groupBy=none&atlOrigin=eyJpIjoiOWVmM2RiZTIzM2U5NGZlZTg4MDMwM2Y4MTUwMGQ1ZjAiLCJwIjoiaiJ9)

## Par où commencer

Cette documentation suit le cadre [Diátaxis](https://diataxis.fr/) : quatre entrées, selon ton besoin du moment.

- 🚀 **[Tutoriels](./tutoriels/pour-bien-demarrer.md)** — tu découvres le projet, tu veux le prendre en main pas à pas.
- 🔧 **[Guides pratiques](./guides/lancer-le-projet-en-local.md)** — tu sais ce que tu cherches à faire : lancer le projet, initialiser la base, contribuer, gérer un incident.
- 📚 **[Référence](./reference/api.md)** — tu cherches une information précise : un endpoint, une variable, le schéma des tables.
- 💡 **[Explications](./explications/architecture.md)** — tu veux comprendre *pourquoi* c'est construit comme ça : architecture, flux, décisions techniques ([ADR](./explications/adr/index.md)).
