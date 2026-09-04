---
sidebar_position: 3
description: Pour qui veut comprendre les choix de gestion d'état côté React. Répond à « pourquoi pas de Redux ni de Context, et où est la limite ? ».
---

# Gestion d'état côté front

Pas de state manager global (Redux, Context API…) à ce jour : chaque composant gère son propre état local avec `useState`.

## Flux de données unidirectionnel

React suit un flux à sens unique :

- **les données descendent** du parent vers l'enfant via les **props** ;
- **les actions remontent** de l'enfant vers le parent via des **callbacks** (des fonctions passées en props, que l'enfant se contente d'appeler).

Exemple avec la suppression : `TaskItem` détient l'état `isDeleteModalOpen` et le passe à `DeleteTaskButton` sous forme de callback (`onDelete`). Le bouton ne sait pas ce que fait cette fonction ni où est stocké l'état — il l'appelle au clic, ce qui le rend réutilisable.

`refreshTasks` suit le même principe sur plusieurs niveaux : `TasksConsultation` détient la vraie liste des tâches et transmet cette fonction en descendant jusqu'à `DeleteConfirmModal`, pour que ce composant profond dans l'arbre puisse déclencher un rechargement sans avoir accès à la liste lui-même. `onCelebrate` suit le même chemin, de `TasksConsultation` jusqu'à `TaskCheckBox` via `TasksList` puis `TaskItem`.

## Quand un state manager deviendrait utile

Le jour où une même donnée (par exemple l'utilisatrice connectée) doit être partagée entre des composants éloignés dans l'arbre, obligeant à faire transiter une prop à travers plusieurs niveaux qui n'en ont pas besoin — c'est le *prop drilling*.

Le token d'authentification s'en approche déjà un peu (`App.jsx` → `TasksConsultation` → `LogoutButton`), mais reste gérable à ce stade. Voir [ADR 004](./adr/004-pas-de-state-manager.md).
