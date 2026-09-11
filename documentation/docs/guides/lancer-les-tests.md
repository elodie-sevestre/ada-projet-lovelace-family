---
sidebar_position: 3
description: Pour la dev qui veut vérifier le backend. Répond à « comment je lance les tests ? ».
---

# Lancer les tests

Le backend a des tests unitaires **Jest** dans `back/tests/`.  
L'inventaire de ce qui est couvert est dans [Référence — Tests](../reference/tests.md).

## Lancer tous les tests

Commandes à exécuter à la racine du projet :

```bash
cd back && npm test
```

## Lancer un seul test

```bash
cd back && npm test -- updateTaskController.test.js
```

> Portée exacte de ces tests (couche mockée, ce qui n'est pas couvert) : [Référence — Tests](../reference/tests.md#couverture).

## En intégration continue

Chaque **push** et chaque **Pull Request** (toutes branches) déclenche `.github/workflows/ci.yml`, qui exécute sur `back/` : `npm ci` → `npm run lint` → `npm run test`.
Détail dans [Conventions — Intégration continue](../reference/conventions.md#intégration-continue-ci).
