---
sidebar_position: 4
description: Pour qui reprend le projet. Répond à « qu'est-ce qui est incomplet ou fragile, et est-ce assumé ? ».
---

# Limites connues et dette technique

Ces points sont **identifiés et assumés**. Une limite écrite vaut mieux qu'une limite ignorée.

## Backend

- **Contrôle d'accès granulaire** — le CRUD a été livré en priorité, la vérification du rôle (`checkRole`) est écrite mais pas encore branchée sur update / validate / delete. Voir [Référence backend](../reference/backend.md) pour le détail des routes concernées.
- **Validation de l'id utilisateur** — `getTasksByUserController` n'a pas encore été aligné sur le même standard de validation que les autres controllers ; écart non intentionnel plutôt que choix assumé. Détail dans la [Référence backend](../reference/backend.md).
- **Tests du endpoint `DELETE`** — seul controller sans test automatisé à ce jour, à combler avant d'étendre la couverture ailleurs.
- **Refresh du token** — le JWT n'expire jamais côté utilisateur ; un mécanisme de refresh reste à concevoir.
- **Calcul des points** — fonctionnalité prévue dès la V1 mais jugée plus complexe qu'anticipé une fois entamée ; la colonne `total_points` existe en base mais rien ne l'incrémente côté backend, le frontend affiche donc la valeur brute stockée.

## Frontend

- **`currentUser` / `currentMember` en dur** — priorité donnée à l'affichage pendant la V1 ; le lien entre le token décodé et l'utilisatrice réelle n'a pas été fait (`// TODO` explicite dans `TasksConsultation.jsx`). Bloque un contrôle d'accès réel côté client. Détail des composants concernés : [Référence frontend](../reference/frontend.md#authentification).
- **`progressPercent` figé** — même origine que le calcul des points ci-dessus : fonctionnalité de gamification partiellement codée. Voir [Référence frontend](../reference/frontend.md#gamification).
- **Pas de tests frontend** — aucun test automatisé côté React à ce jour.

## Infrastructure / CI

- **CI frontend absente** — `.github/workflows/ci.yml` ne couvre que `back/` (lint + test) ; le backend a été priorisé pendant la V1, le frontend reste à couvrir.
- **Vérification de la documentation en CI** — le build Docusaurus (`npm run build`, qui échoue sur lien mort grâce à `onBrokenLinks: "throw"`) n'est pas encore branché dans la CI.
