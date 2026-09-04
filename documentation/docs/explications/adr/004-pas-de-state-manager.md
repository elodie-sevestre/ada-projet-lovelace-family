---
sidebar_position: 5
description: "Décision : état local useState par composant, pas de Redux ni de Context."
---

# 004 — Pas de state manager global

**Statut** : en vigueur, à réévaluer

## Contexte

L'application partage peu d'état entre composants. Le token d'authentification et la liste des tâches sont les seules données qui circulent sur plusieurs niveaux.

## Décision

Chaque composant gère son état local avec `useState`. Les données descendent par props, les actions remontent par callbacks.

## Alternatives écartées

- **Context API** — suffirait pour le token, sans dépendance ; envisageable dès que le *prop drilling* devient gênant.
- **Redux / Zustand** — surdimensionné pour la taille actuelle de l'application.

## Conséquences

- Peu de code, flux de données lisible.
- Du *prop drilling* déjà visible sur `refreshTasks` et `onCelebrate` (voir [Gestion d'état côté front](../gestion-etat-front.md)).
- À réévaluer quand l'utilisatrice connectée devra être lue par des composants éloignés dans l'arbre.
