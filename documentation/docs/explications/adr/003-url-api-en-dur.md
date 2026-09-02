---
sidebar_position: 4
description: "Décision subie : l'URL de l'API est codée en dur côté front au lieu d'utiliser VITE_API_URL."
---

# 003 — URL d'API en dur côté front

**Statut** : à corriger

## Contexte

`docker-compose.yml` définit `VITE_API_URL` pour indiquer au frontend où joindre l'API. Or `front/src/api/client.js` utilise une URL codée en dur : `http://localhost:5000/api`.

## État actuel

La valeur en dur fonctionne pour le développement local, donc la correction n'a pas été priorisée. `VITE_API_URL` est définie mais inutilisée.

## Conséquences

- Impossible de pointer le frontend vers une autre API (préproduction, déploiement) sans modifier le code.
- À remplacer par `import.meta.env.VITE_API_URL`, avec repli sur l'URL locale.
