---
sidebar_position: 4
description: Pour qui veut comprendre comment une route est protégée, et pourquoi ce choix. Répond à « comment le backend sait-il qui a le droit de faire quoi, et pourquoi ce mécanisme ? ».
---

# Authentification et autorisation

Deux middlewares distincts protègent les routes : l'un vérifie *qui* fait la requête (authentification), l'autre vérifie *ce qu'il a le droit de faire* (autorisation par rôle). Ce sont deux questions différentes, posées à deux endroits différents.

## Pourquoi séparer les deux

Une route comme `POST /api/tasks` doit répondre à deux questions dans cet ordre : la personne est-elle connectée ? Et si oui, a-t-elle le rôle Admin ? Mélanger les deux dans un seul middleware obligerait à dupliquer la vérification du token dans chaque contrôle de rôle. En les séparant, `requireAuth` s'occupe uniquement du token et peuple `req.user`, et `checkRole` peut ensuite lire `req.user.role` sans rien connaître du JWT lui-même — il n'a besoin d'être appelé qu'*après* `requireAuth`, jamais seul.

## Fichiers

| Fichier | Rôle |
| ------- | ---- |
| `back/src/middlewares/requireAuthentication.js` | Vérifie la présence et la validité du token, peuple `req.user` |
| `back/src/middlewares/checkRole.js` | Vérifie que `req.user.role` correspond au rôle attendu par la route |
| `back/src/constants.js` | Définit les valeurs de rôle possibles (`ROLE.Admin`, `ROLE.Member`) |

### `requireAuth`

```js
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Token manquant', 401);
  }
  const token = header.slice(7);
  let payload;
  try {
    payload = jwt.verify(token, config.jwt_secret);
  } catch {
    throw new AppError('Token invalide ou expiré', 401);
  }
  req.user = payload;
  next();
}
```

- L'en-tête est découpé à la main (`.slice(7)`) pour retirer le préfixe `"Bearer "` plutôt que d'utiliser une librairie dédiée — suffisant vu le nombre de formats d'en-tête gérés (un seul).
- `jwt.verify` lève une exception si la signature ne correspond pas au secret ou si le token est expiré ; le `catch` transforme ça en `AppError` plutôt que de laisser remonter l'erreur brute de la librairie.
- Le payload décodé (`{ userId, role }`) est déposé sur `req.user`, ce qui le rend disponible à tous les middlewares et controllers suivants dans la chaîne — c'est le seul moyen pour `checkRole` de connaître le rôle sans redécoder le token.

### `createCheckRoleMiddleware`

```js
function createCheckRoleMiddleware(roleWaited) {
  return (req, res, next) => {
    const roleUser = req.user.role;
    if (roleUser === roleWaited) {
      return next();
    }
    throw new AppError('Not found', 404);
  };
}
```

- C'est une **factory** : elle ne prend pas `(req, res, next)` directement, elle prend le rôle attendu et *renvoie* le middleware. Ça permet d'écrire `createCheckRoleMiddleware(ROLE.Admin)` sur une route et `createCheckRoleMiddleware(ROLE.Member)` sur une autre, sans dupliquer la fonction.
- **`404` plutôt que `403`** : un rôle qui ne correspond pas renvoie *"Not found"*, pas *"Forbidden"*. Le choix est de ne pas révéler à quelqu'un de non autorisé que la ressource existe — un `403` confirme son existence et le fait qu'on lui refuse l'accès ; un `404` ne donne aucune information. C'est un compromis volontaire entre transparence et surface d'attaque.
- Suppose que `requireAuth` a déjà été exécuté (sinon `req.user` est `undefined` et `req.user.role` lève une erreur non gérée) — d'où l'ordre obligatoire dans les routes : `requireAuth` avant `createCheckRoleMiddleware(...)`.

## Chemin d'une requête protégée

```
requête ──▶ requireAuth
              │
              ├─ en-tête absent/mal formé ──▶ 401 "Token manquant"
              ├─ token invalide/expiré    ──▶ 401 "Token invalide ou expiré"
              │
              ▼ (token valide, req.user rempli)
            createCheckRoleMiddleware(rôle attendu)  [si la route l'exige]
              │
              ├─ rôle ≠ attendu ──▶ 404 "Not found"
              │
              ▼ (rôle correspondant)
            controller
```

## Codes HTTP

| Code | Signification | Origine |
| ---- | -------------- | ------- |
| `401` | Token absent, mal formé, invalide ou expiré | `requireAuth` |
| `404` | Rôle du token ≠ rôle attendu par la route | `createCheckRoleMiddleware` |

Le détail par endpoint (quelle route exige quel rôle) est dans la [Référence API](../reference/api.md).

## Limites et suites

- Le rôle attendu par route est fixe (`ROLE.Admin` ou aucun contrôle) — il n'existe pas encore de règle du type "Admin OU la personne assignée à cette tâche précise". Voir [Limites et dette](./limites-et-dette.md).
- Aucun mécanisme de révocation de token avant son expiration (3h) : un token volé reste valide jusqu'à son terme.