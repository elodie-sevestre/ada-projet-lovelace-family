---
sidebar_position: 5
description: Pour l'équipe au quotidien. Répond à « quel préfixe de branche, quel type de commit, que fait la CI ? ».
---

# Conventions

Cette page ne liste que les valeurs : préfixes de branche, types de commit, règles partagées.

## Convention de nommage des branches

Une branche par fonctionnalité, bug ou fix, créée depuis `develop`, au format `préfixe/description_breve` :

| Préfixe    | Usage                         |
| ---------- | ----------------------------- |
| `feature`  | Nouvelle fonctionnalité       |
| `fix`      | Correction de bug             |
| `docs`     | Documentation                 |
| `chore`    | Tâche technique / maintenance |
| `refactor` | Refactorisation de code       |

## Convention de messages de commit

Format `type: description courte` (ou `type(portée): description courte`), en français :

| Type       | Usage                                                       |
| ---------- | ----------------------------------------------------------- |
| `feat`     | Nouvelle fonctionnalité                                     |
| `fix`      | Correction de bug                                           |
| `docs`     | Documentation                                               |
| `chore`    | Tâche technique / maintenance                               |
| `refactor` | Refactorisation de code                                     |
| `test`     | Ajout ou modification de tests                              |
| `style`    | Formatage sans effet sur le code (quotes, points-virgules…) |

Exemples tirés de l'historique :

```
feat: ajout du bouton supprimer et du pop-up de confirmation
fix: correctif seed users : admin to ADMIN
refactor(back): centralise les statuts de tâche dans TASK_STATUS
```

> ⚠️ Le type de commit (`feat`) diffère du préfixe de branche (`feature`) — ne pas confondre les deux conventions.

## Constantes partagées

Les valeurs d'énumération de la base ne sont jamais écrites en dur dans le code :

| Constante     | Fichier(s)                                        | Valeurs            |
| ------------- | ------------------------------------------------- | ------------------ |
| `TASK_STATUS` | `back/src/constants.js`, `front/src/constants.js` | `TODO` / `DONE`    |
| `ROLE`        | `back/src/constants.js`                           | `Admin` / `Member` |

Back et front ont chacun leur copie (pas de paquet partagé) : les deux fichiers doivent rester alignés. Toute comparaison de statut ou de rôle passe par la constante, pas par la chaîne littérale.

## Formatage

Le backend utilise **Prettier** (`back/.prettierrc` : quotes simples, points-virgules, 2 espaces, `trailingComma: es5`), lançable avec `npm run format`. Le frontend n'a pas encore Prettier : la convention de fait est double quotes + points-virgules + 2 espaces. L'adoption de Prettier côté front est une tâche à part.

## Protection de `main`

Une Pull Request est obligatoire avant tout merge sur `main`, après approbation de **deux contributrices**.

## Intégration continue (CI)

Chaque `push` et chaque Pull Request (toutes branches confondues) déclenche `.github/workflows/ci.yml`.

Étapes exécutées sur le backend (`back/`) :

1. `npm ci` — installation des dépendances
2. `npm run lint`
3. `npm run test`

> Pas encore de job équivalent côté frontend, ni d'étape de build. Une PR ne devrait pas être mergée si la CI est en échec.
