---
sidebar_position: 6
description: Pour l'équipe au quotidien. Répond à « quel test couvre quoi, et où est le trou ? ».
---

# Tests

Tests unitaires **Jest** du backend, dans `back/tests/`.  
Pour les lancer : [Guide — Lancer les tests](../guides/lancer-les-tests.md).

## Tâches

| Fichier                        | Couvre                                                                                                                                                                                                                                             |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createTaskController.test.js` | création                                                                                                                                                                                                                                           |
| `updateTaskController.test.js` | modification                                                                                                                                                                                                                                       |
| `deleteTaskController.test.js` | suppression                                                                                                                                                                                                                                        |
| `getTaskController.test.js`    | lecture <ul><li>`getAllTasksController` ensemble des tâches</li><li>`getTasksByUserController` tâches de l'utilisateur connecté</li><li>`getTasksByUserIdController` tâches d'un utilisateur ciblé par un admin, avec validation de l'id</li></ul> |

## Auth

| Fichier                         | Couvre                           |
| ------------------------------- | -------------------------------- |
| `createLoginController.test.js` | inscription (création de compte) |
| `connexionController.test.js`   | connexion / émission du token    |

## Gestion d'erreurs

| Fichier                | Couvre                                                                                                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `errorHandler.test.js` | middleware `errorHandler` : mappe les `AppError` sur leur status, message générique + log pour les 5xx, sans fuite d'info technique au client |

## Couverture

| Périmètre                                        | État                     |
| ------------------------------------------------ | ------------------------ |
| Backend — tâches (CRUD complet, `DELETE` inclus) | ✅                       |
| Backend — auth                                   | ✅                       |
| Backend — middleware d'erreurs                   | ✅                       |
| Frontend                                         | ❌ aucun test automatisé |

Portée : ces tests mockent la couche `services` — validation des entrées et formatage HTTP uniquement, ni SQL ni JWT réel.
