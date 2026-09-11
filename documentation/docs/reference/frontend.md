---
sidebar_position: 3
description: Pour l'équipe au quotidien. Répond à « quel composant fait quoi côté front ? ».
---

# Frontend

Stack : **React** + **Vite**.

## Authentification

`App.jsx` détient l'état `token`, initialisé via `getToken()` (module `front/src/lib/session.js`) au premier rendu. Sans token, `LoginForm` est affiché ; dès qu'il y en a un, `TasksConsultation` prend sa place.

- **`LoginForm`** — formulaire email / mot de passe, validation côté client (format email, mot de passe ≥ 8 caractères) avant l'appel `POST /auth/connexion`. Enregistre le token reçu via `saveToken()`, remonte l'info à `App.jsx` via `setToken`. État `loading` pendant la requête ; erreurs (401, erreur serveur) affichées sous le formulaire.
- **`LogoutButton`** — appelle `onLogout` (prop reçue de `App.jsx`). La suppression du token (`clearToken()`) et le reset du state sont portés par `App.jsx`.
- **`api/client.js`** — ajoute `Authorization: Bearer <token>` sur chaque requête (token relu via `getToken()` à chaque appel). Réponse `401` → `clearToken()` puis redirection vers `/`.
- **`lib/session.js`** — point unique pour le token : `getToken()`, `saveToken(token)`, `clearToken()`. Seul endroit qui connaît la clé `localStorage` (`"token"`) ; `App.jsx`, `LoginForm` et `client.js` passent par lui.

## Gamification

- **`MemberSideBar`** — carte affichée à côté de la liste : avatar, initiale + nom du membre, total de points, barre de progression (`progressPercent`).
  :::note
  `progressPercent` est actuellement une valeur figée en dur : aucune source de données n'alimente ce palier.
  :::
- **`TaskCelebration`** — animation (gif) + son de victoire déclenchés quand une tâche passe à `TERMINE`. Durée de l'animation calée sur celle du fichier audio une fois ses métadonnées chargées, avec timer de repli si l'évènement `ended` ne se déclenche jamais.
- **`TaskCheckBox`** — bascule le statut d'une tâche (`A_FAIRE` ↔ `TERMINE`, via la constante `TASK_STATUS` de `front/src/constants.js`) via checkbox stylée, déclenche une animation locale, appelle `onCelebrate` uniquement en passant à `TERMINE`. Flux API : [Flux applicatifs](../explications/flux-applicatifs.md#modification-dune-tâche).

## Modales : création / édition / suppression

Même principe pour les trois : un composant parent détient un booléen d'état qui pilote l'affichage conditionnel de la modale.

- **Suppression** : `TaskItem` détient `isDeleteModalOpen` → `DeleteConfirmModal`. Suppression déclenchée uniquement après confirmation explicite dans la modale (pas de flux « toast + annulation »).
- **Création** : `TasksConsultation` détient `isCreating` → `CreateTaskModal` → `TaskForm`. Liste des membres assignables récupérée une fois via `getUsers()` au montage de `TasksConsultation`, transmise en prop jusqu'au formulaire.
- **Édition** : `TaskItem` détient `isEditModalOpen` → `EditTaskModal` → `EditTaskForm`. La même liste de membres est transmise par prop drilling (`TasksConsultation` → `TasksList` → `TaskItem` → `EditTaskModal` → `EditTaskForm`) pour peupler le sélecteur d'assignation ; les statuts du formulaire viennent de la constante `TASK_STATUS`.
- **Contrôle d'accès** : dans `TaskItem`, les boutons d'édition et de suppression ne sont rendus que si `currentUser.role === "ADMIN"` — `currentUser` est encore en dur, voir [Limites et dette](../explications/limites-et-dette.md).

## Communication avec l'API

Tous les appels HTTP passent par `api/client.js`, qui centralise les headers JSON, le token (`getToken()`) et la gestion des erreurs (`response.ok`, `401`). Les modules comme `api/tasks.js` appellent `get` / `post` / `put` / `del` avec la route voulue.

Le raisonnement sur la gestion d'état (props, callbacks, prop drilling) est dans [Gestion d'état côté front](../explications/gestion-etat-front.md).
