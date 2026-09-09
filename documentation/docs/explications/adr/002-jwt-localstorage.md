---
sidebar_position: 3
description: "Décision : le token JWT est stocké côté navigateur dans le localStorage."
---

# 002 — JWT stocké dans le localStorage

**Statut** : en vigueur

## Contexte

Après `POST /auth/connexion`, le frontend reçoit un JWT à durée de vie courte (valeur exacte fixée côté backend, voir [Référence API](../../reference/api.md#post-authconnexion)) qu'il doit conserver pour l'envoyer sur chaque requête protégée.

## Décision

Stockage dans le `localStorage`, relu par `front/src/api/client.js` à chaque appel pour composer l'en-tête `Authorization: Bearer <token>`.

## Alternatives écartées

- **Cookie `httpOnly` + `Secure`** — mieux protégé contre le vol de token par XSS, mais impose une gestion CSRF et une configuration serveur des cookies.
- **Mémoire seule (state React)** — le plus sûr, mais l'utilisatrice est déconnectée à chaque rechargement de page.

## Conséquences

- Simple à implémenter, persiste au rechargement.
- Vulnérable au vol de token si une faille XSS est présente dans le frontend.
- Le token n'ayant ni révocation ni refresh (voir [Limites et dette](../limites-et-dette.md)), une fuite reste exploitable jusqu'à son expiration.
- Sur une réponse `401`, `client.js` purge le token du `localStorage` et renvoie l'utilisatrice vers l'écran de connexion.
