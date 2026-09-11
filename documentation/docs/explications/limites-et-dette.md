---
sidebar_position: 5
description: Pour qui reprend le projet. Répond à « qu'est-ce qui est incomplet ou fragile, et est-ce assumé ? ».
---

# Limites connues et dette technique

Ces points sont **identifiés et assumés**. Une limite écrite vaut mieux qu'une limite ignorée.

## Backend

- **Contrôle d'accès « ADMIN ou membre assigné »** — les routes de modification / suppression / création vérifient le rôle ADMIN (`checkRole(ROLE.Admin)` est bien branché dans `tasksRoutes.js` sur PUT / DELETE / POST et GET `/`), mais le cas « un membre peut agir sur _sa_ tâche » n'est pas implémenté : le contrôle reste tout-ou-rien par rôle. Détail des routes : [Référence API](../reference/api.md#routes-apitasks).
- **Validation de l'id utilisateur** — `getTasksByUserController` n'a pas encore été aligné sur le même standard de validation que les autres controllers ; écart non intentionnel plutôt que choix assumé. Détail dans la [Référence API](../reference/api.md).
- **Refresh du token** — le JWT n'expire jamais côté utilisateur ; un mécanisme de refresh reste à concevoir.
- **Calcul des points** — fonctionnalité prévue dès la V1 mais jugée plus complexe qu'anticipé une fois entamée ; la colonne `total_points` existe en base mais rien ne l'incrémente côté backend, le frontend affiche donc la valeur brute stockée.
- **Validation des entrées éparpillée** — chaque controller valide ses champs à la main (`if (...) throw new AppError(..., 400)`), avec de la logique répétée d'un controller à l'autre. Pas de bibliothèque de schéma (type `zod`), pas de borne de longueur côté serveur (le `maxLength` du front n'est pas répliqué). L'injection SQL est déjà couverte : les `models/` utilisent des requêtes paramétrées (`$1`, `$2`). Piste : centraliser la validation dans des schémas `zod` levant une `AppError` 400.

## Frontend

- **`currentUser` / `currentMember` en dur** — priorité donnée à l'affichage pendant la V1 ; le lien entre le token décodé et l'utilisatrice réelle n'a pas été fait (`// TODO` explicite dans `TasksConsultation.jsx`). Bloque un contrôle d'accès réel côté client. Détail des composants concernés : [Référence frontend](../reference/frontend.md#authentification).
- **`progressPercent` figé** — même origine que le calcul des points ci-dessus : fonctionnalité de gamification partiellement codée. Voir [Référence frontend](../reference/frontend.md#gamification).
- **Pas de tests frontend** — aucun test automatisé côté React à ce jour.

## Infrastructure / CI

- **CI frontend absente** — `.github/workflows/ci.yml` ne couvre que `back/` (lint + test) ; le backend a été priorisé pendant la V1, le frontend reste à couvrir.
- **Vérification de la documentation en CI** — le build Docusaurus (`npm run build`, qui échoue sur lien mort grâce à `onBrokenLinks: "throw"`) n'est pas encore branché dans la CI.
