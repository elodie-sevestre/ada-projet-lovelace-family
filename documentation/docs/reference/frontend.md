---
sidebar_position: 3
description: Pour l'équipe au quotidien. Répond à « quel composant fait quoi côté front ? ».
---

# Frontend

Stack : **React** + **Vite**.

## Structure

```
front/src/
├── App.jsx                  # composant racine, gère l'auth (token) et bascule Login / App
├── main.jsx                 # point d'entrée, monte l'app React
├── api/
│   ├── client.js            # wrapper générique autour de fetch (get/post/put/del), ajoute le token
│   ├── tasks.js             # appels API tâches (getTasks, createTask, editTask, deleteTask)
│   └── users.js             # liste des membres (getUsers)
├── components/
│   ├── LoginForm.jsx           # formulaire de connexion
│   ├── LogoutButton.jsx        # bouton de déconnexion
│   ├── TasksList.jsx           # liste des tâches
│   ├── TasksConsultation.jsx   # vue de consultation des tâches (une fois connectée)
│   ├── MemberSideBar.jsx       # carte membre : avatar, points, progression
│   ├── TaskCelebration.jsx     # animation + son à la validation d'une tâche
│   ├── TaskItem.jsx            # une tâche dans la liste
│   ├── TaskCheckBox.jsx        # checkbox de validation d'une tâche (change son statut)
│   ├── TaskModalItem.jsx       # détail d'une tâche en modale
│   ├── CreateTaskButton.jsx    # ouvre la modale de création
│   ├── CreateTaskModal.jsx     # encapsule TaskForm dans une modale
│   ├── TaskForm.jsx            # formulaire de création de tâche
│   ├── EditTaskForm.jsx        # formulaire de modification de tâche
│   ├── EditTaskButton.jsx      # bouton déclenchant l'édition
│   ├── DeleteTaskButton.jsx    # ouvre la modale de confirmation
│   └── DeleteConfirmModal.jsx  # confirmation + appel API + gestion d'erreur
└── css/                     # une feuille de style par composant
```

## Authentification

`App.jsx` détient l'état `token`, initialisé depuis `localStorage.getItem("token")` au premier rendu. Sans token, `LoginForm` est affiché ; dès qu'il y en a un, `TasksConsultation` prend sa place.

- **`LoginForm`** — formulaire email / mot de passe, validation côté client (format email, mot de passe ≥ 8 caractères) avant l'appel `POST /auth/connexion`. Stocke le token reçu dans le `localStorage`, remonte l'info à `App.jsx` via `setToken`. Un état `loading` désactive le bouton pendant la requête ; les erreurs (401, erreur serveur) s'affichent sous le formulaire.
- **`LogoutButton`** — appelle `onLogout` (prop). La déconnexion elle-même (suppression du token, reset du state) est gérée dans `App.jsx`, pas dans le bouton.
- **`api/client.js`** — ajoute automatiquement `Authorization: Bearer <token>` sur chaque requête (token relu depuis le `localStorage` à chaque appel). Si le serveur répond `401`, le token est supprimé et l'utilisatrice est redirigée vers `/`.

## Gamification

- **`MemberSideBar`** — carte affichée à côté de la liste : avatar, initiale + nom du membre, total de points, barre de progression (`progressPercent`, encore figée en dur — pas de source de données pour ce palier).
- **`TaskCelebration`** — animation (gif) + son de victoire déclenchés quand une tâche passe à `TERMINE`. La durée de l'animation se cale sur celle du fichier audio une fois ses métadonnées chargées, avec un timer de repli si l'évènement `ended` ne se déclenche jamais.
- **`TaskCheckBox`** — remplace la validation d'une tâche par une checkbox stylée : au clic, bascule le statut (`A_FAIRE` ↔ `TERMINE`), déclenche une courte animation locale, et appelle `onCelebrate` uniquement en passant à `TERMINE`. Flux API associé : [Flux applicatifs](../explications/flux-applicatifs.md#modification-dune-tâche).

## Modales : création / édition / suppression

Même principe pour les trois : un composant parent détient un booléen d'état qui pilote l'affichage conditionnel de la modale.

- **Suppression** : `TaskItem` détient `isDeleteModalOpen` → `DeleteConfirmModal`. La suppression n'est déclenchée qu'après confirmation explicite (pas de « toast + annulation », pour éviter les suppressions accidentelles).
- **Création** : `TasksConsultation` détient `isCreating` → `CreateTaskModal` → `TaskForm`. La liste des membres assignables est récupérée une fois via `getUsers()` au montage de `TasksConsultation`, puis transmise en prop jusqu'au formulaire.
- Les boutons d'édition / suppression ne s'affichent que pour un `currentUser` avec `role === "ADMIN"`.

## Communication avec l'API

Tous les appels HTTP passent par `api/client.js`, qui centralise les headers JSON, le token et la gestion des erreurs (`response.ok`, `401`). Les modules comme `api/tasks.js` appellent simplement `get` / `post` / `put` / `del` avec la route voulue.

Le raisonnement sur la gestion d'état (props, callbacks, prop drilling) est dans [Gestion d'état côté front](../explications/gestion-etat-front.md).
