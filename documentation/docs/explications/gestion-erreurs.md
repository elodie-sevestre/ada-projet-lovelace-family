---
sidebar_position: 5
description: Pour qui veut comprendre comment les erreurs sont traitées côté backend. Répond à « où part une erreur levée dans un controller, et pourquoi ce découpage ? ».
---

# Gestion centralisée des erreurs

Le backend traite toutes ses erreurs à un seul endroit : le middleware `errorHandler`, placé en bout de chaîne Express. Les controllers ne gèrent plus les erreurs eux-mêmes ; ils se contentent de lever (`throw`) une erreur.

## Pourquoi

Auparavant, chaque controller portait son propre `try/catch` :

```js
} catch (error) {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message });
}
```

Ce bloc était dupliqué dans chaque fonction, avec des variantes incohérentes :

- certains renvoyaient le message brut d'une erreur 500 au client (`Détails erreur ${err}`), exposant des informations internes : message Postgres, fragment de requête SQL, chemin de fichier ;
- le format de réponse variait d'un controller à l'autre (`{ error }` contre `{ erreur }`) ;
- toute évolution (logger, identifiant de corrélation…) devait être répétée partout.

Centraliser donne un seul format de réponse, une seule règle de masquage des erreurs serveur, et des controllers qui décrivent _ce qui ne va pas_ sans se soucier de _comment répondre_.

## Fichiers

| Fichier                                | Rôle                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `back/src/middlewares/errorHandler.js` | Transforme une erreur en réponse HTTP. Enregistré une fois dans `server.js`. |
| `back/src/utils/AppError.js`           | Classe d'erreur applicative portant un `statusCode`.                         |
| `back/src/utils/logger.js`             | Journalisation structurée (JSON). Seule frontière autorisée vers `console`.  |

### `AppError`

```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}
```

Un `AppError` est une `Error`, avec un champ `statusCode` en plus. On l'utilise pour signaler une erreur attendue (validation, ressource absente) accompagnée de son code HTTP. Les controllers **et** les services lèvent des `AppError` (ex. `updateTaskService` → `404` si la tâche n'existe pas).

### `errorHandler`

```js
import { logger } from "../utils/logger.js";

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isServerError = statusCode >= 500;
  const message = isServerError ? "Erreur serveur" : err.message;
  if (isServerError) {
    logger.error(err.message, { statusCode, stack: err.stack });
  }
  res.status(statusCode).json({ error: message });
}
```

- **Signature à quatre paramètres** `(err, req, res, next)` : c'est à ce nombre de paramètres qu'Express reconnaît un middleware d'erreur, et il ne l'appelle que lorsqu'une erreur lui est transmise. `next` doit donc figurer dans la signature même s'il n'est pas utilisé dans le corps.  
  Comme le linter signale alors un paramètre inutilisé (et ferait échouer la CI du backend), on ajoute le commentaire `// eslint-disable...` juste au-dessus de la fonction pour désactiver cette règle sur cette ligne.
- **`statusCode`** : lu sur l'erreur. `AppError` le fournit (controllers comme services). Absent → `500`, soit « erreur non prévue ».
- **Masquage des erreurs serveur** : pour tout code ≥ 500, le message interne peut contenir des données sensibles ; on renvoie un texte générique (`Erreur serveur`) et on journalise la stack **côté serveur uniquement**, via `logger.error(message, { statusCode, stack })`. Pour un code < 500, le message a été rédigé pour l'utilisateur : il est transmis tel quel.
- **Format de réponse** : toujours `{ "error": "<message>" }`.

### `logger`

`back/src/utils/logger.js` expose `logger.error / warn / info`, qui écrivent une ligne JSON sur la sortie standard (`{ level, ts, msg, ...contexte }`). C'est le **seul** module autorisé à appeler `console` directement (`/* eslint-disable no-console */` en tête de fichier) ; partout ailleurs, passer par `logger`. `errorHandler` s'en sert pour journaliser les erreurs 5xx.

## Branchement dans `server.js`

```js
import errorHandler from "./middlewares/errorHandler.js";

app.use("/api/users", usersRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/auth", loginRoutes);

app.use(errorHandler); // après toutes les routes
```

Express exécute les middlewares dans l'ordre de déclaration. Le gestionnaire d'erreur doit être le dernier maillon pour recevoir les erreurs de toutes les routes déclarées avant lui.

## Chemin d'une erreur

Le backend utilise **Express 5**, qui capture automatiquement les promesses rejetées par un handler `async`.

1. Un controller `async` fait `throw new AppError('...', 400)` ; un service peut aussi lever un `AppError` (ex. `updateTaskService` → `404`).
2. La fonction `async` rejette sa promesse.
3. Express 5 intercepte le rejet et appelle le premier middleware d'erreur enregistré, avec l'erreur en argument.
4. `errorHandler` lit `err.statusCode`, construit la réponse et l'envoie.

```
controller / service  ──throw──▶  rejet de promesse
                                        │
                                        ▼
                          Express 5 capture le rejet
                                        │
                                        ▼
                     errorHandler(err, req, res, next)
                                        │
                                        ▼
              statusCode = err.statusCode || 500
              si ≥ 500 : logger.error(msg, { statusCode, stack }) + message = « Erreur serveur »
                                        │
                                        ▼
              res.status(statusCode).json({ error: message })
```

En Express 4, cette capture n'existe pas : il aurait fallu un `try/catch` dans chaque controller, ou un wrapper `asyncHandler` appelant `.catch(next)`. Avec Express 5, ce n'est plus nécessaire.

## Écrire un controller

- Pas de `try/catch` dans un controller.
- Pas de `res.status(...).json(...)` pour signaler une erreur.
- Erreur métier prévue : `throw new AppError(message, statusCode)`.
- Les erreurs des services et de la base remontent automatiquement ; ne rien faire.
- En cas de succès : `res.status(...).json(...)` normalement.

```js
async function getTaskController(req, res) {
  const task = await getTaskService(req.params.id);
  if (!task) {
    throw new AppError("Tâche introuvable", 404);
  }
  res.status(200).json(task);
}
```

## Codes HTTP

| Code  | Signification                                  | Origine                                                                      |
| ----- | ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `400` | Données de requête invalides                   | `throw new AppError(msg, 400)` dans le controller                            |
| `401` | Identifiants de connexion invalides            | `throw new AppError(msg, 401)` dans `connexionController`                    |
| `404` | Ressource inexistante                          | `throw new AppError(msg, 404)`, controller ou service                        |
| `404` | Rôle insuffisant sur une route protégée        | `checkRole` — choix délibéré (`404` et non `403`, on ne révèle pas la route) |
| `409` | Conflit : ressource déjà existante (mail pris) | `createLoginService` traduit le `code 23505` Postgres                        |
| `500` | Erreur non maîtrisée (bug, base indisponible)  | `statusCode` absent, message masqué                                          |

Les codes retour par endpoint sont détaillés dans la [Référence API](../reference/api.md).

## Limites et suites

- La validation reste écrite à la main dans les controllers (`if (...) throw`). Elle pourrait être extraite dans un middleware dédié ou un schéma `zod` levant une `AppError` 400.
- `errorHandler` pourrait recevoir un identifiant de corrélation (logs / réponse) pour tracer une requête de bout en bout.
- Les tests des controllers de tâches sont adaptés au contrat `throw`.

Voir aussi [Limites et dette technique](./limites-et-dette.md).
