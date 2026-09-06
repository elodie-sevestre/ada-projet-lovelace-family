---
sidebar_position: 1
description: Pour qui reprend le projet. Répond à « quelles décisions structurantes ont été prises, et pourquoi ? ».
---

# ADR — Architecture Decision Records

Un ADR consigne **une décision** qui engage le projet : le contexte, l'option retenue, les alternatives écartées, les conséquences. On ne réécrit pas un ADR : s'il est remis en cause, on en écrit un nouveau qui le remplace.

| ADR | Décision | Statut |
| --- | -------- | ------ |
| [001](./001-pas-d-orm.md) | Pas d'ORM, SQL brut via `pg` | en vigueur |
| [002](./002-jwt-localstorage.md) | JWT stocké dans le `localStorage` | en vigueur |
| [003](./003-url-api-en-dur.md) | URL d'API en dur côté front | à corriger |
| [004](./004-pas-de-state-manager.md) | Pas de state manager global | en vigueur, à réévaluer |
