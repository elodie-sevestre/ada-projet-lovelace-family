---
sidebar_position: 1
description: Pour qui veut comprendre comment le projet est organisé. Répond à « où se trouve quoi, et pourquoi c'est rangé comme ça ? ».
---

# Architecture

Lovelace Family est un mono-repo à quatre dossiers principaux :

```
ada-projet-lovelace-family/
├── back/            # API Express (Node.js)
├── front/           # Application React (Vite)
├── db/              # Fichiers SQL (structure, seed, requêtes de référence)
└── documentation/   # Site Docusaurus (ce que tu es en train de lire)
```

Ce document couvre l'organisation de `back/` et `front/` : ce qui vit où, et pourquoi c'est rangé ainsi. Pour ce qui se passe *dans le temps* (le trajet d'une requête du clic jusqu'à la base), voir [Flux applicatifs](./flux-applicatifs.md).

## Backend — `back/`

```
back/
├── config/
│   └── env.js              # Charge et valide les variables d'environnement au démarrage
├── src/
│   ├── constants.js         # Constantes partagées (ex. ROLE.Admin, ROLE.Member)
│   ├── server.js            # Point d'entrée : monte les routes, démarre le serveur
│   ├── routes/               # Déclare les endpoints HTTP, aiguille vers un controller
│   ├── controllers/          # Valide req.body/req.params, appelle un service, formate la réponse
│   ├── services/             # Logique métier
│   ├── models/               # Requêtes SQL brutes via pg
│   ├── middlewares/          # requireAuthentication, checkRole, errorHandler
│   └── utils/                # AppError, logger
└── tests/                     # Tests Jest, un fichier par controller
```

Le découpage `routes → controllers → services → models` sépare quatre responsabilités qui ne changent pas pour les mêmes raisons :

- **`routes/`** — associe un chemin HTTP à un controller, rien de plus.
- **`controllers/`** — gère le format HTTP (`req`/`res`) : valide l'entrée, met en forme la sortie. Aucune règle métier ici.
- **`services/`** — porte les règles métier (ex. : créer une tâche *et* l'assigner à un membre en une seule opération), sans référence à HTTP.
- **`models/`** — exécute le SQL, sans connaissance des règles métier.

Chaque couche ne dépend que de celle juste en dessous.

`middlewares/` et `utils/` sont transverses : ils ne font pas partie du découpage en couches, mais sont utilisés à travers plusieurs d'entre elles (ex. `AppError` est levée aussi bien dans un controller que dans un service).

## Frontend — `front/`

```
front/
├── public/                    # Fichiers statiques servis tels quels
└── src/
    ├── main.jsx                # Point d'entrée React
    ├── App.jsx                 # Composant racine
    ├── api/                     # Fonctions fetch, un fichier par ressource (tasks.js, users.js) + client.js commun
    ├── components/
    │   ├── layout/               # Structure de page (AppHeader, MemberSideBar)
    │   ├── tasks/                 # Tout ce qui concerne l'affichage des tâches (TasksList, TaskItem, TaskCheckBox, TaskCelebration...)
    │   ├── forms/                 # Formulaires (LoginForm, TaskForm, EditTaskForm)
    │   ├── modals/                 # Fenêtres modales (CreateTaskModal, EditTaskModal, DeleteConfirmModal...)
    │   └── buttons/                 # Boutons réutilisables (CreateTaskButton, DeleteTaskButton, EditTaskButton, LogoutButton)
    ├── css/                      # Un fichier de styles par composant
    └── assets/                   # Images, sons, icônes
```

Deux choix structurants ici :

- **`components/` est découpé par rôle** (layout, tasks, forms, modals, buttons), pas par écran. Un bouton ou une modale utilisé à plusieurs endroits n'a donc qu'un seul emplacement, pas une copie par écran qui l'utilise.
- **`api/` centralise tous les appels réseau.** Aucun composant ne fait de `fetch` directement : ils passent par les fonctions de `api/tasks.js` ou `api/users.js`, elles-mêmes construites sur `api/client.js`. Ça isole l'URL de base de l'API à un seul endroit — même si, actuellement, cette URL est codée en dur plutôt que lue depuis une variable d'environnement (voir [ADR 003](./adr/003-url-api-en-dur.md)).

## Base de données — `db/`

```
db/
├── migration_up.sql     # Crée la structure des tables
├── migration_down.sql   # Annule la migration (supprime les tables)
├── seed.sql             # Données de test (comptes Bernard et Léa, tâches d'exemple)
└── queries.sql          # Requêtes de référence, à consulter au besoin
```

Ces fichiers s'exécutent manuellement (extension PostgreSQL de VS Code) — voir [Initialiser la base de données](../guides/initialiser-la-bdd.md). Le schéma détaillé des tables est dans [Référence — Base de données](../reference/base-de-donnees.md).

## Décisions structurantes

Les choix qui engagent le projet dans la durée sont consignés en [ADR](./adr/index.md) : JWT en `localStorage`, URL d'API en dur, absence de state manager global.