# Fonctionnalité : connexion / authentification

> Fiche pédagogique — à utiliser comme support de review de code.
> Portée : inscription, connexion (génération de token), middleware de vérification de token. Ne couvre pas encore la protection effective des routes ni le frontend (voir §4).

## 1. Vue d'ensemble

Deux parcours distincts, qui partagent la même table `users` :

```
POST /auth/inscription                    POST /auth/connexion
  → createLoginController                         → connexionController
  → createLoginService (hash bcrypt)         → connexionService (vérif + JWT)
  → createLoginModel (INSERT)                → findUserByEmail (SELECT)
        │                                           │
        ▼                                           ▼
   ligne créée en base                    token JWT renvoyé au client
```

Un troisième morceau, `requireAuth`, est écrit mais **pas encore branché** sur une route : il servira à protéger les endpoints qui doivent exiger un token valide (ex. `tasksRoutes.js`).

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
    const { role, name, mail, tribe_name, password_hash } = req.body;

    const createLogin = await createLoginService(
      role,
      name,
      mail,
      tribe_name,
      password_hash,
    );

    res.status(201).json(createLogin);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
```

Points à retenir :

- Le champ envoyé par le client s'appelle `password_hash` dans `req.body`, mais à ce stade **ce n'est encore que le mot de passe en clair tapé par l'utilisateur** — le nom de variable est trompeur (il désigne ce qu'il deviendra après le service, pas ce qu'il est ici). Point à surveiller en review : un nom de variable qui décrit un état futur plutôt que l'état actuel de la donnée.
- `res.status(201)` : code HTTP standard pour une création de ressource réussie (équivalent du `204` vu pour la suppression, mais `201` renvoie en plus la ressource créée).

### 2.3 Service — `back/src/services/loginServices.js`

```js
const createLoginService = async (
  role,
  name,
  mail,
  tribe_name,
  password_hash,
) => {
  // 1. On transforme le mot de passe en hash irréversible
  const hash = await bcrypt.hash(password_hash, 10); // 10 = "coût" du calcul

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

⚠️ **À surveiller en review** : `createLoginModel` insère `password_hash` (le hash) tel quel, y compris dans le `RETURNING *`, et le contrôleur renvoie `createLogin` (donc potentiellement le hash) au client dans la réponse `201`. Le commentaire du contrôleur dit _"on ne renvoie jamais le hash au client"_ mais rien dans le code ne filtre actuellement `password_hash` avant l'envoi — à vérifier/corriger avant mise en production.

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
    { userId: user.id, role: user.role },
    config.jwt_secret,
    { expiresIn: "24h" },
  );

  return token;
};
```

Points à retenir :

- **`bcrypt.compare(password, user.password_hash)`** : on ne "déhash" jamais le mot de passe stocké (impossible, voir §2.3) ; à la place, `bcrypt` re-hash le mot de passe fourni avec le même salt que celui intégré dans `user.password_hash`, et compare les deux hash. C'est la seule façon de vérifier un mot de passe hashé.
- **Même réponse (`null`) que l'email soit inconnu ou le mot de passe faux.** C'est volontaire : si l'erreur précisait _"email inconnu"_ vs _"mot de passe incorrect"_, un attaquant pourrait déterminer quels emails sont inscrits en base (_enumération d'utilisateurs_), simplement en testant des adresses. Le contrôleur traduit ensuite ce `null` unique en un seul message `401 "Identifiants invalides"`.
- **Le payload du JWT ne contient que `userId` et `role`**, jamais le mot de passe, le hash, ou d'autres données sensibles. Le contenu d'un JWT n'est **pas chiffré**, seulement signé : n'importe qui peut le décoder et lire le payload (essayer sur jwt.io), seule la signature (vérifiable uniquement avec `jwt_secret`) garantit qu'il n'a pas été modifié. D'où la règle : jamais de secret dans un payload JWT.
- **`expiresIn: "24h"`** : le token devient invalide après 24h, même s'il n'a pas été volé — limite la fenêtre d'exploitation si un token fuite.
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

## 4. Middleware `requireAuth` — écrit, pas encore branché

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

### 4.2 Ce qui manque pour que ce soit actif

Ce middleware est actuellement **importé mais jamais utilisé** comme middleware de route (`back/src/routes/loginRoutes.js:2`). Pour protéger une route, il doit être passé en argument avant le contrôleur :

```js
tasksRoutes.post("/", requireAuth, createTaskController);
```

Tant que ce branchement n'est fait nulle part, `usersRoutes.js` et `tasksRoutes.js` restent accessibles sans aucun token — c'est l'étape prévue juste après cette fiche.

## 5. Limites actuelles / suite possible

- **`requireAuth` n'est branché sur aucune route** (§4.2) — les endpoints tasks/users ne sont pas encore protégés.
- **Le hash risque d'être renvoyé au client à l'inscription** (§2.4) — à vérifier/filtrer.
- **`JWT_SECRET` n'est pas dans la liste des variables obligatoires** de `back/config/env.js` (seules `POSTGRES_USER`/`POSTGRES_PASSWORD` le sont) : si la variable est absente du `.env`, le serveur démarre quand même et `jwt.sign`/`jwt.verify` échoueront silencieusement plus tard au lieu d'un échec explicite au démarrage.
- **Aucun frontend** : pas de formulaire de connexion/inscription, pas de stockage du token côté client, pas d'ajout du header `Authorization` sur les futurs appels API protégés.
- **Pas de déconnexion ni de refresh token** — un token expiré (24h) oblige simplement à se reconnecter, aucune mécanique de renouvellement.
- **Pas de test automatisé** pour `/auth/inscription`, `/auth/connexion` ou `requireAuth`.

## 6. Grille de review rapide

- [ ] Le mot de passe n'est jamais stocké ni renvoyé en clair.
- [ ] `password_hash` n'apparaît jamais dans une réponse HTTP au client (inscription comme connexion).
- [ ] La comparaison de mot de passe passe par `bcrypt.compare`, jamais par une comparaison directe de chaînes.
- [ ] Le message d'erreur de connexion ne distingue pas "email inconnu" de "mot de passe incorrect".
- [ ] Le payload du JWT ne contient que des données non sensibles (`userId`, `role`).
- [ ] Le secret JWT vient bien de `config.jwt_secret` (donc de `.env`), jamais codé en dur dans le fichier.
- [ ] Toute requête SQL reste paramétrée (`$1`, `$2`...), jamais de concaténation.
- [ ] Avant de considérer la fonctionnalité "terminée" : `requireAuth` est effectivement appliqué aux routes qui doivent l'être.
