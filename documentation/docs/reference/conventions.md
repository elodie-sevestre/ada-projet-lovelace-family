---
sidebar_position: 5
description: Pour l'équipe au quotidien. Répond à « quel préfixe de branche, quel type de commit, que fait la CI ? ».
---

# Conventions

Le circuit pas à pas est dans [Contribuer](../guides/contribuer.md). Cette page ne liste que les valeurs.

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

Format `type: description courte`, en français :

| Type       | Usage                         |
| ---------- | ----------------------------- |
| `feat`     | Nouvelle fonctionnalité       |
| `fix`      | Correction de bug             |
| `docs`     | Documentation                 |
| `chore`    | Tâche technique / maintenance |
| `refactor` | Refactorisation de code       |

Exemples tirés de l'historique :

```
feat: ajout du bouton supprimer et du pop-up de confirmation
fix: correctif seed users : admin to ADMIN
docs: ajout fiche review fonctionnalité supprimer une tâche
```

> ⚠️ Le type de commit (`feat`) diffère du préfixe de branche (`feature`) — ne pas confondre les deux conventions.

## Protection de `main`

Une Pull Request est obligatoire avant tout merge sur `main`, après approbation de **deux contributrices**.

## Intégration continue (CI)

Chaque `push` et chaque Pull Request (toutes branches confondues) déclenche `.github/workflows/ci.yml`.

Étapes exécutées sur le backend (`back/`) :

1. `npm ci` — installation des dépendances
2. `npm run lint`
3. `npm run test`

> Pas encore de job équivalent côté frontend, ni d'étape de build. Une PR ne devrait pas être mergée si la CI est en échec.
