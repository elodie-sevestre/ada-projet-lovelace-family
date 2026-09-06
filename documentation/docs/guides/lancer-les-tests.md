---
sidebar_position: 3
description: Pour la dev qui veut vérifier le backend. Répond à « comment je lance les tests ? ».
---

# Lancer les tests

Le backend a des tests unitaires **Jest**, dans `back/tests/` :

- `createTaskController.test.js`
- `updateTaskController.test.js`

```bash
cd back
npm test
```

Ces tests **mockent la couche `services`** au lieu d'appeler la vraie base de données : ils vérifient la validation des entrées et le formatage des réponses HTTP, pas le SQL.

## Couverture actuelle

- ✅ `createTaskController`, `updateTaskController`
- ❌ `deleteTaskController` — pas encore testé (voir [Limites et dette](../explications/limites-et-dette.md))
- ❌ Frontend — pas de tests automatisés à ce jour

## En intégration continue

Chaque `push` et chaque Pull Request (toutes branches) déclenche `.github/workflows/ci.yml`, qui exécute sur `back/` : `npm ci` → `npm run lint` → `npm run test`. Détail dans [Conventions — Intégration continue](../reference/conventions.md#intégration-continue-ci).
