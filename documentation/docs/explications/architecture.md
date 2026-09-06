---
sidebar_position: 1
description: Pour qui veut comprendre la structure d'ensemble. Répond à « comment les trois couches communiquent, et pourquoi ce découpage ? ».
---

# Architecture

Lovelace Family suit une architecture classique en trois couches, orchestrée par Docker Compose :

```
┌────────────┐      HTTP / REST      ┌───────────┐      SQL (pg)       ┌────────────┐
│ Frontend   │  ─────────────────▶   │ Backend   │  ────────────────▶  │ PostgreSQL │
│ React+Vite │                       │ Express   │                     │            │
│ :5173      │  ◀─────────────────   │ :5000     │  ◀────────────────  │ :5432      │
└────────────┘      JSON             └───────────┘                     └────────────┘
```

## Frontend → Backend

Le frontend appelle l'API via `fetch`, centralisé dans `front/src/api/client.js`. L'URL de base est actuellement codée en dur (`http://localhost:5000/api`) au lieu d'être lue depuis `VITE_API_URL` — voir [ADR 003](./adr/003-url-api-en-dur.md).

## Backend : découpage en couches

Le backend est découpé en couches, dossier par dossier dans `back/src/` :

- **`routes/`** — déclare les endpoints HTTP et les associe à un controller (aiguillage) ;
- **`controllers/`** — valide les données de la requête (`req.body`, `req.params`) et formate la réponse HTTP ;
- **`services/`** — logique métier (ex. : créer une tâche *et* l'assigner à un membre en une seule opération) ;
- **`models/`** — exécute les requêtes SQL brutes via `pg`.

Ce découpage sépare le transport HTTP (controllers) de la logique métier (services) et de l'accès aux données (models). Chaque couche est testable et remplaçable isolément : les tests unitaires du backend mockent d'ailleurs la couche `services` pour tester les controllers sans base de données.

## Backend → Base de données

La connexion à PostgreSQL passe par un `Pool` (`pg`), configuré une seule fois dans `back/src/models/configDb.js` à partir des variables d'environnement, puis réutilisé par tous les models. Un pool évite de rouvrir une connexion à chaque requête.

## Décisions structurantes

Les choix qui engagent le projet sont consignés en [ADR](./adr/index.md) : absence d'ORM, JWT en `localStorage`, URL d'API en dur, absence de state manager global.
