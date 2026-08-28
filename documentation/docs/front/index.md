# Front-end

Stack : **React** + **Vite**.

## Structure

```
front/src/
├── App.jsx                  # composant racine, gère l'auth (token) et bascule Login/App
├── main.jsx                 # point d'entrée, monte l'app React
├── api/
│   ├── client.js             # wrapper générique autour de fetch (get/post/put/del), ajoute le token
│   ├── tasks.js               # appels API spécifiques aux tâches (getTasks, createTask, editTask, deleteTask)
│   └── users.js               # récupère la liste des membres (getUsers)
├── components/
│   ├── LoginForm.jsx            # formulaire de connexion
│   ├── LogoutButton.jsx         # bouton de déconnexion
│   ├── TasksList.jsx            # liste des tâches
│   ├── TasksConsultation.jsx    # vue de consultation des tâches (une fois connecté)
│   ├── MemberSideBar.jsx        # carte membre : avatar, points, progression
│   ├── TaskCelebration.jsx      # animation + son à la validation d'une tâche
│   ├── TaskItem.jsx              # une tâche dans la liste
│   ├── TaskCheckBox.jsx          # checkbox de validation d'une tâche (change son statut)
│   ├── TaskModalItem.jsx         # détail d'une tâche en modale
│   ├── CreateTaskButton.jsx      # déclenche l'ouverture de la modal de création
│   ├── CreateTaskModal.jsx       # encapsule TaskForm dans une modal
│   ├── TaskForm.jsx              # formulaire de création de tâche
│   ├── EditTaskForm.jsx          # formulaire de modification de tâche
│   ├── EditTaskButton.jsx        # bouton déclenchant l'édition
│   ├── DeleteTaskButton.jsx      # déclenche l'ouverture de la modal de confirmation
│   └── DeleteConfirmModal.jsx     # confirmation + appel API + gestion d'erreur
└── css/                       # une feuille de style par composant
```

## Authentification

`App.jsx` détient l'état `token`, initialisé depuis `localStorage.getItem("token")` au premier rendu. Tant qu'il n'y a pas de token, `LoginForm` est affiché ; dès qu'il y en a un, `TasksConsultation` prend sa place.

- **`LoginForm`** — formulaire email/mot de passe avec validation côté client (format email, mot de passe ≥ 8 caractères) avant l'appel API. Appelle `POST /auth/connexion`, stocke le token reçu dans `localStorage`, puis remonte l'info à `App.jsx` via `setToken`. Un état `loading` désactive le bouton pendant la requête ; les erreurs (401, erreur serveur) sont affichées sous le formulaire.
- **`LogoutButton`** — composant simple, appelle `onLogout` (prop). La déconnexion elle-même (suppression du token, reset du state) est gérée dans `App.jsx`, pas dans le bouton.
- **`api/client.js`** — envoie automatiquement l'en-tête `Authorization: Bearer <token>` sur chaque requête (token relu depuis `localStorage` à chaque appel). Si le serveur répond `401`, le token est supprimé et l'utilisateur est redirigé vers `/` (retour à l'écran de connexion).

> **Limite connue** : même connecté, `currentUser`/`currentMember` restent en dur dans `TasksConsultation.jsx` (`{ role: "ADMIN" }`, `members[0]`) — pas encore de lien réel entre le token décodé et l'utilisateur affiché/ses droits (`// TODO` explicite dans le code).

## Gamification

- **`MemberSideBar`** — carte affichée à côté de la liste des tâches : avatar, initiale + nom du membre, total de points, barre de progression (`progressPercent`, encore figée en dur — pas de source de données pour ce palier).
- **`TaskCelebration`** — animation (gif) + son de victoire déclenchés quand une tâche passe à `TERMINE`. La durée de l'animation se cale sur la durée réelle du fichier audio une fois ses métadonnées chargées, avec un timer de repli si l'évènement `ended` ne se déclenche jamais (ex. lecture bloquée par le navigateur).
- **`TaskCheckBox`** — remplace la validation d'une tâche par une checkbox stylée (au lieu d'un formulaire) : au clic, bascule le statut (`A_FAIRE` ↔ `TERMINE`), déclenche une courte animation locale, et appelle `onCelebrate` uniquement en passant à `TERMINE`. Voir aussi la doc [Back-end](../back/index.md#flux--modification-dune-tâche-changement-de-statut-via-checkbox) pour le flux API associé.

## Structure / suppression / édition

La suppression suit le même principe que l'édition : `TaskItem` détient un état booléen (`isDeleteModalOpen`) qui pilote l'affichage conditionnel de `DeleteConfirmModal`. La suppression n'est déclenchée qu'après confirmation explicite de l'utilisateur (pas de "toast + annulation", pour rester simple et éviter les suppressions accidentelles).

La création suit le même principe : `TasksConsultation` détient l'état `isCreating` qui pilote l'affichage de `CreateTaskModal`, laquelle encapsule `TaskForm`. La liste des membres assignables (`members`) est récupérée une fois via `getUsers()` au montage de `TasksConsultation`, puis transmise en prop jusqu'au formulaire.

Les actions d'édition/suppression (`EditTaskButton`, `DeleteTaskButton`) ne sont affichées que pour un `currentUser` avec `role === "ADMIN"` (voir `TasksList`/`TaskItem`).

## Communication avec l'API

Tous les appels HTTP passent par `api/client.js`, qui centralise la gestion des headers JSON, du token d'authentification et des erreurs (`response.ok`, `401`). Les modules comme `api/tasks.js` n'ont qu'à appeler `get`/`post`/`put`/`del` avec la route voulue, sans se soucier des détails de `fetch`.

## Gestion d'état

Pas de state manager global (Redux, Context API...) à ce jour : chaque composant gère son propre état local avec `useState`.

React suit un flux de données unidirectionnel :

- **les données descendent** du parent vers l'enfant via les **props**
- **les actions remontent** de l'enfant vers le parent via des **callbacks** (des fonctions passées en props, que l'enfant se contente d'appeler)

Exemple avec la suppression : `TaskItem` détient l'état `isDeleteModalOpen` et le passe à `DeleteTaskButton` sous forme de callback (`onDelete`). Le bouton ne sait pas ce que fait cette fonction ni où est stocké l'état, il se contente de l'appeler au clic — ce qui le rend réutilisable. `refreshTasks` suit le même principe sur plusieurs niveaux : `TasksConsultation` détient la vraie liste des tâches et transmet cette fonction en descendant jusqu'à `DeleteConfirmModal`, pour que ce composant profond dans l'arbre puisse déclencher un rechargement sans avoir accès à la liste lui-même. `onCelebrate` suit le même chemin, de `TasksConsultation` jusqu'à `TaskCheckBox` via `TasksList` puis `TaskItem`, pour déclencher `TaskCelebration` sans que ces composants intermédiaires aient besoin de connaître son fonctionnement.

Un state manager global deviendrait utile si une même donnée (ex: l'utilisateur connecté) devait être partagée entre des composants éloignés dans l'arbre, obligeant à faire transiter une prop à travers plusieurs niveaux qui n'en ont pas besoin (_prop drilling_). Le token d'authentification s'en approche déjà un peu (`App.jsx` → `TasksConsultation` → `LogoutButton`), mais reste gérable à ce stade.
