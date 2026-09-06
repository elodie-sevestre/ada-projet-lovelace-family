---
sidebar_position: 4
description: Pour qui reprend le projet. Répond à « qu'est-ce qui est incomplet ou fragile, et est-ce assumé ? ».
---

# Limites connues et dette technique

Ces points sont **identifiés et assumés**. Une limite écrite vaut mieux qu'une limite ignorée.

## Backend

- **Contrôle d'accès granulaire** — seul un ADMIN ou l'utilisateur assigné devrait pouvoir modifier / valider une tâche. Actuellement, n'importe quel token valide le permet.
- **Validation de l'id utilisateur** — dans `getTasksByUserController`, l'id n'est pas validé avant d'être passé au service (contrairement à `updateTaskController` / `deleteTaskController`).
- **Tests du endpoint `DELETE`** — pas de test automatisé, contrairement aux autres controllers.
- **Gestion d'erreurs unifiée** — les erreurs sont renvoyées avec un message générique, sans distinction des causes.
- **Refresh du token** — le JWT n'expire jamais côté utilisateur ; un mécanisme de refresh serait un plus.
- **Calcul des points** — la colonne `total_points` existe en base mais rien côté backend ne l'incrémente à la validation d'une tâche ; le frontend affiche la valeur brute stockée.

## Frontend

- **`currentUser` / `currentMember` en dur** — dans `TasksConsultation.jsx` (`{ role: "ADMIN" }`, `members[0]`) : pas encore de lien réel entre le token décodé et l'utilisatrice affichée / ses droits (`// TODO` explicite dans le code).
- **`progressPercent` figé** — la barre de progression de `MemberSideBar` n'a pas de source de données.
- **Pas de tests frontend.**

## Infrastructure / CI

- **CI frontend absente** — `.github/workflows/ci.yml` ne couvre que `back/` (lint + test). Pas d'étape de build.
- **Vérification de la documentation en CI** — le build Docusaurus (`npm run build`, qui échoue sur lien mort grâce à `onBrokenLinks: "throw"`) n'est pas encore branché dans la CI.
