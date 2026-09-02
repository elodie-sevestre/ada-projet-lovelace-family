---
sidebar_position: 0
description: Pour toute personne qui découvre le projet. Répond à « c'est quoi Lovelace Family et par où commencer ? ».
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

## Par où commencer

Cette documentation suit le cadre [Diátaxis](https://diataxis.fr/) : quatre entrées, selon ton besoin du moment.

- 🚀 **[Tutoriels](./tutoriels/prise-en-main.md)** — tu découvres le projet et tu veux le prendre en main pas à pas.
- 🔧 **[Guides pratiques](./guides/lancer-le-projet-en-local.md)** — tu sais ce que tu cherches à faire : lancer le projet, jouer le schéma, contribuer, gérer un incident.
- 📚 **[Référence](./reference/api.md)** — tu cherches une information précise : un endpoint, une variable, le schéma des tables.
- 💡 **[Explications](./explications/architecture.md)** — tu veux comprendre *pourquoi* c'est construit comme ça : architecture, flux, décisions techniques ([ADR](./explications/adr/index.md)).

:::note Toi dans six mois

La destinataire qu'on oublie toujours : elle aura tout oublié du contexte actuel. Si une info te paraît « évidente » aujourd'hui, c'est justement celle-là qu'il faut écrire.

:::
