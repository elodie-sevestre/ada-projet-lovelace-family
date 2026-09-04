---
sidebar_position: 2
description: Pour qui veut comprendre le chemin d'une requête. Répond à « que se passe-t-il, dans l'ordre, du clic jusqu'à la base ? ».
---

# Flux applicatifs

Quatre parcours types, du frontend jusqu'à la base de données. Les codes retour détaillés sont dans la [Référence API](../reference/api.md).

## Création d'une tâche

1. `POST /api/tasks` arrive sur `tasksRoutes.js`, aiguillé vers `createTaskController`.
2. Le middleware `requireAuth` vérifie le token.
3. Le controller valide les champs (`name`, `assignment`, `points`).
4. `createTaskServices` crée la tâche puis l'assigne dans la table pivot `users_tasks`.
5. Le controller renvoie la tâche créée avec le code `201`.

## Consultation des tâches

Deux endpoints :

- `GET /api/tasks` → toutes les tâches ;
- `GET /api/tasks/users/:id` → les tâches d'un utilisateur donné.

Le service retourne un objet `{ toDoTasks, finishedTasks }` : le tri par statut est fait côté backend, pas côté frontend.

## Modification d'une tâche

Changement de statut via la checkbox :

1. `TaskCheckBox.jsx` envoie `{ status: "TERMINE" | "A_FAIRE", name, description, points }`.
2. `requireAuth` vérifie le token.
3. `updateTaskController` valide l'id et les champs.
4. `updateTaskServices` exécute la mise à jour.
5. Réponse `200` avec la tâche modifiée.
6. Côté frontend, si le nouveau statut est `TERMINE`, `onCelebrate` déclenche `TaskCelebration`.

## Suppression d'une tâche

1. L'utilisatrice confirme dans `DeleteConfirmModal`.
2. `DELETE /api/tasks/:id` → `deleteTaskController`, après `requireAuth`.
3. Le controller valide que l'id est un entier.
4. `deleteTaskServices` supprime la tâche ; les assignations dans `users_tasks` partent en cascade (`ON DELETE CASCADE`).
5. Réponse `204` sans corps.
