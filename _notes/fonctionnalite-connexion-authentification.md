# Fonctionnalité : connexion / authentification

> Fiche pédagogique — à utiliser comme support de review de code.
> Portée : inscription, connexion (génération de token), middleware de vérification de token. `requireAuth` est maintenant branché sur les routes qui le nécessitent. Ne couvre pas encore le frontend (voir §5).

## 1. Vue d'ensemble

Deux parcours distincts, qui partagent la même table `users` :

```
POST /auth/inscription                    POST /auth/connexion
  → createLoginController                   → connexionController
  → createLoginService (hash bcrypt)         → connexionService (vérif + JWT)
  → createLoginModel (INSERT)                → findUserByEmail (SELECT)
        │                                           │
        ▼                                           ▼
   ligne créée en base                    token JWT renvoyé au client
```

Un troisième morceau, `requireAuth`, est **maintenant branché** sur `tasksRoutes` et `usersRoutes` via `router.use(requireAuth)` : toutes les routes de création/lecture/modification/suppression de tâches et d'utilisateurs exigent un token valide.

Même découpage en couches que pour la suppression de tâche : route → contrôleur → service → modèle, chacune avec une seule responsabilité.

## 2. Inscription — `POST /auth/inscription`

### 2.1 Route — `back/src/routes/loginRoutes.js`

```js
loginRoutes.post("/inscription", createLoginController);
```

### 2.2 Contrôleur — `back/src/controllers/loginControllers.js`

```js
const createLoginController = async (req, res) => {
  try {
    const { role, name, mail, tribe_name, password } = req.body;

    if (!name || !mail || !password) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    await createLoginService(role, name, mail, tribe_name, password);

    // On ne renvoie jamais le hash au client
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Inscription impossible" });
  }
};
```

Points à retenir :

- **La déstructuration récupère `password` en clair** (c'est ce que le client envoie), pas `password_hash`. Le nom de variable décrit l'état réel de la donnée à ce stade. Le hashage se fait uniquement dans le service, d'où le changement : `password` → `password_hash` dans `req.body`.
- **Validation des champs requis avant tout appel au service** (`name`, `mail`, `password`) : même logique que la validation de l'`id` pour la suppression de tâche. Retour `400 Bad Request`.
- **`res.status(204).send()` sur succès** : `204 No Content` (pas `201`) car la réponse n'a pas de corps — l'inscription a réussi, mais on ne renvoie rien (ni la ressource créée, ni le hash). Ça ferme définitivement le risque de fuite du hash au client.
- **Message d'erreur générique** (`"Inscription impossible"`) plutôt que le détail technique d'une erreur SQL — protège contre l'énumération d'utilisateurs ("email déjà utilisé ?" serait dangereux). Le détail reste accessible côté serveur via `console.error(error)`.

### 2.3 Service — `back/src/services/loginServices.js`

```js
const createLoginService = async (role, name, mail, tribe_name, password) => {
  // 1. On transforme le mot de passe en hash irréversible
  const hash = await bcrypt.hash(password, 10); // 10 = "coût" du calcul

  await createLoginModel(role, name, mail, tribe_name, hash);
};
```

**Pourquoi hasher le mot de passe ?** On ne stocke jamais un mot de passe en clair en base : si la base est un jour compromise (fuite, dump SQL volé...), un attaquant ne doit récupérer que le hash, pas le mot de passe réel. `bcrypt.hash` produit un condensat **à sens unique** — impossible de retrouver le mot de passe d'origine à partir du hash, seulement de vérifier qu'un mot de passe donné correspond au hash (voir §3.3).

Le `10` est le "coût" (_salt rounds_) : plus il est élevé, plus le calcul est lent — volontairement, pour rendre les attaques par force brute plus coûteuses. `10` est une valeur standard, un bon compromis entre sécurité et temps de calcul.

`bcrypt` génère aussi automatiquement un _salt_ (donnée aléatoire) intégré au hash, ce qui fait que deux utilisateurs avec le même mot de passe auront des hash différents en base.

### 2.4 Modèle — `back/src/models/loginModels.js`

```js
const createLoginModel = async (
  role,
  name,
  mail,
  tribe_name,
  password_hash,
) => {
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (role, name, mail, tribe_name, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [role, name, mail, tribe_name, password_hash],
    );
    return rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
```

Requête paramétrée (`$1`...`$5`), comme pour les autres modèles du projet : jamais de concaténation de chaîne SQL avec des valeurs venant du client.

## 3. Connexion — `POST /auth/connexion`

### 3.1 Route

```js
loginRoutes.post("/connexion", connexionController);
```

### 3.2 Contrôleur

```js
const connexionController = async (req, res) => {
  const { mail, password } = req.body;
  if (!mail || !password) {
    return res.status(400).json({ erreur: "Email et mot de passe requis" });
  }

  try {
    const token = await connexionService(mail, password);

    if (!token) {
      return res.status(401).json({ erreur: "Identifiants invalides" });
    }

    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erreur: "Erreur serveur" });
  }
};
```

Points à retenir :

- **Validation de présence avant tout appel au service** (`mail`/`password`), même logique que la validation de l'`id` pour la suppression de tâche.
- **`401` pour identifiants invalides**, distinct du `400` (requête mal formée) et du `500` (erreur technique imprévue) — trois causes d'échec, trois codes différents, pour que le front (plus tard) puisse réagir différemment à chacune.

### 3.3 Service

```js
const connexionService = async (mail, password) => {
  // 1. On retrouve l'utilisateur par son email
  const user = await findUserByEmail(mail);
  if (!user) {
    return null;
  }

  // 2. On compare le mot de passe fourni au hash stocké
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return null;
  }

  // 3. On fabrique le token : id + rôle, JAMAIS d'infos sensibles !
  const token = jwt.sign(
    { userId: user.id, role: user.role }, //payload : contenu du token
    config.jwt_secret, // à ajouter dans config/env.js et .env
    { expiresIn: "24h" },
  );

  return token;
};
```

Points à retenir :

- **`bcrypt.compare(password, user.password_hash)`** : on ne "déhash" jamais le mot de passe stocké (impossible, voir §2.3) ; à la place, `bcrypt` re-hash le mot de passe fourni avec le même salt que celui intégré dans `user.password_hash`, et compare les deux hash. C'est la seule façon de vérifier un mot de passe hashé.
- **Même réponse (`null`) que l'email soit inconnu ou le mot de passe faux.** C'est volontaire : si l'erreur précisait _"email inconnu"_ vs _"mot de passe incorrect"_, un attaquant pourrait déterminer quels emails sont inscrits en base (_énumération d'utilisateurs_), simplement en testant des adresses. Le contrôleur traduit ensuite ce `null` unique en un seul message `401 "Identifiants invalides"`.
- **Le payload du JWT ne contient que `userId` et `role`**, jamais le mot de passe, le hash, ou d'autres données sensibles. Le contenu d'un JWT n'est **pas chiffré**, seulement signé : n'importe qui peut le décoder et lire le payload (essayer sur jwt.io), seule la signature (vérifiable uniquement avec `jwt_secret`) garantit qu'il n'a pas été modifié. D'où la règle : jamais de secret dans un payload JWT.
- **`expiresIn: '24h'`** : le token devient invalide après 24h, même s'il n'a pas été volé — limite la fenêtre d'exploitation si un token fuite.
- **`async`/`await`** partout ici (pas de `.then`/`.catch` comme côté front) : `bcrypt.compare` et `findUserByEmail` renvoient des promesses ; `await` met en pause l'exécution de la fonction jusqu'à ce que la promesse soit résolue, ce qui permet d'écrire du code asynchrone qui se lit comme du code séquentiel. C'est la même mécanique de promesse que le `.then` vu côté front pour `deleteTask`, juste une syntaxe différente pour la consommer.

### 3.4 Modèle — `findUserByEmail`

```js
const findUserByEmail = async (mail) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE mail = $1", [
      mail,
    ]);
    return rows[0]; // undefined si aucun utilisateur trouvé
  } catch (error) {
    console.log(error);
    throw error;
  }
};
```

Renvoie `undefined` (pas d'erreur) si aucun utilisateur ne correspond — c'est ce `undefined` que le service transforme en `null` explicite au §3.3, pour que l'absence de résultat soit un cas géré plutôt qu'une valeur ambiguë qui remonterait telle quelle.

## 4. Middleware `requireAuth` — maintenant branché

### 4.1 Code — `back/src/middlewares/requireAuth.js`

```js
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ erreur: "Token manquant" });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, config.jwt_secret);
    req.user = payload; // { userId, role } dispo dans les routes suivantes
    next();
  } catch (err) {
    return res.status(401).json({ erreur: "Token invalide ou expiré" });
  }
}
```

Points à retenir :

- **Convention `Authorization: Bearer <token>`** : standard HTTP pour transmettre un token — le préfixe `"Bearer "` fait 7 caractères, d'où le `slice(7)` pour isoler le token seul.
- **`jwt.verify` vérifie la signature ET l'expiration** en une seule étape : si le token a été modifié (signature invalide) ou a dépassé son `expiresIn`, la fonction lève une erreur, capturée par le `catch`.
- **`req.user = payload`** : c'est ce qui permettra à n'importe quel contrôleur placé _après_ ce middleware d'accéder à `req.user.userId` et `req.user.role`, sans avoir à revérifier le token soi-même.
- **`next()`** : rend la main au middleware/contrôleur suivant dans la chaîne. Sans cet appel, la requête resterait bloquée indéfiniment (pas de réponse envoyée).

### 4.2 Application aux routes protégées

`requireAuth` est **maintenant appliqué** à toutes les routes qui le nécessitent via `router.use(requireAuth)` en haut de chaque fichier de route :

**`back/src/routes/tasksRoutes.js`** :

```js
import requireAuth from "../middlewares/requireAuth.js";

const tasksRoutes = Router();
tasksRoutes.use(requireAuth); // protège toutes les routes tasks

tasksRoutes.post("/", createTaskController);
tasksRoutes.get("/", getAllTasksController);
// ... reste des routes
```

**`back/src/routes/usersRoutes.js`** :

```js
import requireAuth from "../middlewares/requireAuth.js";

const usersRoutes = Router();
usersRoutes.use(requireAuth); // protège toutes les routes users

usersRoutes.get("/", getAllUsersController);
```

Placer `router.use(middleware)` **avant** toutes les déclarations de route garantit que le middleware s'applique à chaque requête reçue par ce routeur.

**Routes restées ouvertes (intentionnellement)** : `/auth/inscription` et `/auth/connexion` ne sont **pas** protégées — il faut bien pouvoir s'inscrire et se connecter sans token pour en obtenir un.

## 5. Configuration — variables d'environnement obligatoires

### 5.1 `back/config/env.js`

```js
const required = ["JWT_SECRET", "POSTGRES_USER", "POSTGRES_PASSWORD"];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0 && !isTest) {
  console.error("");
  console.error("❌ Variables d'environnement manquantes :");
  missing.forEach((key) => console.error(` - ${key}`));
  console.error("");
  console.error(
    "👉 Copie .env.example vers .env et remplis les valeurs manquantes.",
  );
  console.error("");
  process.exit(1);
}

export const config = {
  // ...
  jwt_secret: process.env.JWT_SECRET,
};
```

**`JWT_SECRET` est maintenant obligatoire** : le serveur refuse de démarrer s'il manque du `.env`, plutôt que d'échouer silencieusement plus tard sur chaque `/auth/connexion` ou `requireAuth`.

La vérification des variables obligatoires est **bypassée pendant les tests** (`NODE_ENV === 'test'`) pour permettre de lancer les tests sans `.env` complet.

## 6. Formatage — `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

Tous les fichiers backend `.js` sont formatés selon cette config (guillemets simples, 2 espaces, etc.). Lance `npm run format` depuis `back/` pour reformater après modifications si `feature/ci` est mergée, ou utilise l'extension Prettier de VS Code en l'absence de script npm.

## 7. Limites actuelles / suite possible

- **Aucun frontend** : pas de formulaire de connexion/inscription, pas de stockage du token côté client, pas d'ajout du header `Authorization` sur les appels API protégés.
- **Pas de vérification de rôle** (ADMIN vs MEMBRE) — l'authentification existe (`requireAuth` valide le token), mais pas l'autorisation par rôle. À ajouter plus tard si nécessaire.
- **Pas de déconnexion ni de refresh token** — un token expiré (24h) oblige simplement à se reconnecter, aucune mécanique de renouvellement.
- **Pas de test automatisé** pour `/auth/inscription`, `/auth/connexion` ou `requireAuth`.
- **`feature/ci` non mergée** — outillage complet (eslint, CI/CD, scripts npm complets) sur une branche séparée, à fusionner une fois prête.

## 8. Grille de review rapide

- [ ] Le mot de passe n'est jamais stocké ni renvoyé en clair.
- [ ] Le paramètre du contrôleur/service s'appelle `password` (jusqu'au service), puis devient `hash` à partir du moment où `bcrypt.hash` est appliqué.
- [ ] La validation des champs requis a lieu **avant** tout appel au service.
- [ ] L'inscription renvoie `204` sans corps (pas de risque de fuite du hash).
- [ ] Le message d'erreur à l'inscription est générique (`"Inscription impossible"`) et le détail reste en `console.error`.
- [ ] La comparaison de mot de passe passe par `bcrypt.compare`, jamais par une comparaison directe de chaînes.
- [ ] Le message d'erreur de connexion ne distingue pas "email inconnu" de "mot de passe incorrect".
- [ ] Le payload du JWT ne contient que des données non sensibles (`userId`, `role`).
- [ ] Le secret JWT vient bien de `config.jwt_secret` (donc de `.env`), jamais codé en dur dans le fichier.
- [ ] `JWT_SECRET` est dans la liste des variables obligatoires de `config/env.js`.
- [ ] Toute requête SQL reste paramétrée (`$1`, `$2`...), jamais de concaténation.
- [ ] `requireAuth` est appliqué via `router.use(requireAuth)` en haut des fichiers de route.
- [ ] `/auth/inscription` et `/auth/connexion` restent ouvertes (pas de `requireAuth` sur elles).
- [ ] Tous les fichiers `.js` du backend sont formatés avec guillemets simples et 2 espaces.
