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

Un `AppError` est une `Error`, avec un champ `statusCode` en plus. On l'utilise pour signaler une erreur attendue (validation, ressource absente) accompagnée de son code HTTP.

### `errorHandler`

```js
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isServerError = statusCode >= 500;
  const message = isServerError ? "Erreur serveur" : err.message;
  if (isServerError) {
    console.error(err);
  }
  res.status(statusCode).json({ error: message });
}
```

- **Signature à quatre paramètres** `(err, req, res, next)` : c'est à ce nombre de paramètres qu'Express reconnaît un middleware d'erreur, et il ne l'appelle que lorsqu'une erreur lui est transmise. `next` doit donc figurer dans la signature même s'il n'est pas utilisé dans le corps.  
  Comme le linter signale alors un paramètre inutilisé (et ferait échouer la CI du backend), on ajoute le commentaire `// eslint-disable...` juste au-dessus de la fonction pour désactiver cette règle sur cette ligne.
- **`statusCode`** : lu sur l'erreur. `AppError` le fournit, les services aussi. Absent → `500`, soit « erreur non prévue ».
- **Masquage des erreurs serveur** : pour tout code ≥ 500, le message interne peut contenir des données sensibles ; on renvoie un texte générique (`Erreur serveur`) et on journalise la stack complète **côté serveur uniquement**. Pour un code < 500, le message a été rédigé pour l'utilisateur : il est transmis tel quel.
- **Format de réponse** : toujours `{ "error": "<message>" }`.

## Branchement dans `server.js`

```js
import errorHandler from "./middlewares/errorHandler.js";

app.use("/api/tasks", tasksRoutes);
app.use("/auth", loginRoutes);

app.use(errorHandler); // après toutes les routes
```

Express exécute les middlewares dans l'ordre de déclaration. Le gestionnaire d'erreur doit être le dernier maillon pour recevoir les erreurs de toutes les routes déclarées avant lui.

## Chemin d'une erreur

Le backend utilise **Express 5**, qui capture automatiquement les promesses rejetées par un handler `async`.

1. Un controller `async` fait `throw new AppError('...', 400)`, ou un service lève une erreur portant un `.statusCode`.
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
              statusCode = err.statusCode || 500
              si ≥ 500 : console.error(err) + message = « Erreur serveur »
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

| Code  | Signification                                 | Origine                                               |
| ----- | --------------------------------------------- | ----------------------------------------------------- |
| `400` | Données de requête invalides                  | `throw new AppError(msg, 400)` dans le controller     |
| `404` | Ressource inexistante                         | `throw new AppError(msg, 404)`, controller ou service |
| `500` | Erreur non maîtrisée (bug, base indisponible) | `statusCode` absent, message masqué                   |

Les codes retour par endpoint sont détaillés dans la [Référence API](../reference/api.md).

## Limites et suites

- La validation reste écrite à la main dans les controllers (`if (...) throw`). Elle pourrait être extraite dans un middleware dédié ou un schéma `zod` levant une `AppError` 400.
- Les controllers de `loginControllers.js` gardent leur propre `try/catch` ; leur migration vers `errorHandler` fera l'objet d'un autre lot.
- `errorHandler` pourrait recevoir un identifiant de corrélation (logs / réponse) et un logger structuré à la place de `console.error`.
- Les tests unitaires des controllers de tâches ne sont pas encore adaptés au nouveau contrat (`throw` au lieu de `res.status`) ; un test isolé de errorHandler reste à écrire.

Voir aussi [Limites et dette technique](./limites-et-dette.md).
