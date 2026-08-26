# Architecture

Lovelace Family suit une architecture classique en trois couches, orchestrée par Docker Compose :

```
┌────────────┐      HTTP / REST      ┌───────────┐      SQL (pg)       ┌────────────┐
│ Frontend   │  ------------------>  │ Backend   │ ------------------> │ PostgreSQL │
│ React+Vite │                       │ Express   │                     │            │
│ :5173      │  <------------------  │ :5000     │ <------------------ │ :5432      │
└────────────┘      JSON             └───────────┘                     └────────────┘
```

## Frontend → Backend

Le frontend appelle l'API via `fetch`, centralisé dans `front/src/api/client.js`. L'URL de base est actuellement codée en dur (`http://localhost:5000/api`) plutôt que lue depuis la variable d'environnement `VITE_API_URL` définie dans `docker-compose.yml` (point à corriger un jour).

## Backend : architecture en couches

Le backend suit un découpage en couches, dossier par dossier dans `back/src/` :

- **`routes/`** : déclare les endpoints HTTP et les associe à un controller (aiguillage)
- **`controllers/`** : valide les données de la requête (`req.body`, `req.params`) et formate la réponse HTTP
- **`services/`** : contient la logique métier (ex: créer une tâche _et_ l'assigner à un membre en une seule opération)
- **`models/`** : exécute les requêtes SQL brutes via `pg`

## Backend → Base de données

La connexion à PostgreSQL est gérée par un `Pool` (`pg`), configuré une seule fois dans `back/src/models/configDb.js` à partir des variables d'environnement, puis réutilisé par tous les models.
