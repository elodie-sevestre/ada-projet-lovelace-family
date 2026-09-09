---
sidebar_position: 2
description: Pour qui veut comprendre le chemin d'une requête. Répond à « que se passe-t-il, dans l'ordre, du clic jusqu'à la base, et pourquoi ce découpage ? ».
---

# Flux applicatifs

Toutes les requêtes protégées suivent le même squelette côté backend. Comprendre ce squelette une fois suffit ; chaque parcours n'en est qu'une variante. Les corps de requête et les codes retour exacts sont dans la [Référence API](../reference/api.md) ; le traitement des erreurs dans [Gestion centralisée des erreurs](./gestion-erreurs.md).

## Le squelette commun

```
clic front → requête HTTP → routes → requireAuth → controller → service → model → PostgreSQL
                                                        │           │        │
                                                   validation   logique   SQL brut
                                                    des entrées   métier
```

1. **`routes/`** associe l'URL et le verbe à un controller. Aucun traitement, juste l'aiguillage — c'est le seul endroit qui connaît la forme des URL.
2. **`requireAuth`** s'exécute avant le controller : inutile de valider ou de toucher la base si le token est absent ou invalide. Un maillon unique porte cette règle pour toutes les routes protégées.
3. **`controller`** valide `req.body` / `req.params` et formate la réponse HTTP. Il ne parle jamais SQL : il délègue au service. S'il détecte une entrée invalide, il `throw` (voir [Gestion des erreurs](./gestion-erreurs.md)).
4. **`service`** porte la logique métier — l'enchaînement d'opérations qui a un sens fonctionnel, indépendamment du transport HTTP. C'est la couche mockée dans les tests de controllers.
5. **`model`** exécute les requêtes SQL paramétrées via `pg`. Seule couche qui connaît le schéma.

Ce découpage permet de tester chaque couche isolément et de remplacer le transport (HTTP) ou le stockage (SQL) sans toucher au métier.

## Création d'une tâche

`POST /api/tasks` → `createTaskController`.

Ce qui est propre à ce parcours : le service fait **deux écritures** — il crée la ligne dans `tasks`, puis l'assigne dans la table pivot `users_tasks`. C'est là que se justifie la couche service : un seul appel controller, une opération métier composée.

## Consultation des tâches

`GET /api/tasks` (toutes) ou `GET /api/tasks/users/:id` (celles d'un utilisateur).

Le service renvoie un objet `{ toDoTasks, finishedTasks }` : **le tri par statut est fait côté backend**, pas côté frontend. Le front affiche deux colonnes sans avoir à filtrer — la logique de regroupement est au même endroit pour tous les clients.

## Modification d'une tâche

`PUT /api/tasks/:id` → `updateTaskController`, déclenché par la checkbox de `TaskCheckBox`.

Le controller valide l'id **et** les champs (même règle que création). Après la réponse, si le nouveau statut est `TERMINE`, le frontend déclenche l'animation `TaskCelebration` — cet effet est purement côté client, le backend ne fait que persister le changement de statut.

## Suppression d'une tâche

`DELETE /api/tasks/:id` → `deleteTaskController`, après confirmation dans `DeleteConfirmModal`.

Le controller ne valide que l'id (entier). Le model supprime la ligne de `tasks` ; les lignes correspondantes de `users_tasks` partent **en cascade** (`ON DELETE CASCADE`, voir [Référence — Base de données](../reference/base-de-donnees.md#table-users_tasks)). Sans cette cascade, il faudrait supprimer manuellement les assignations avant la tâche, ou accepter des lignes pivot orphelines.
