# Sécurité — Lovelace Family

> Dépôt : github.com/elodie-sevestre/ada-projet-lovelace-family — Revue du 2026-08-26 sur **`develop`**.

## 1. Sécurité de base

### 1.1 Audit des dépendances

`npm audit` exécuté sur `back/` et `front/` le 26/08/2026 :

```
back$ npm audit
found 0 vulnerabilities

front$ npm audit
3 high severity vulnerabilities (brace-expansion, nanoid, postcss)
To address all issues, run: npm audit fix

front$ npm audit fix
changed 3 packages, and audited 136 packages in 2s
found 0 vulnerabilities
```

Vulnérabilités trouvées sur `front/`, traitées le jour même via `npm audit fix` → 0 vulnérabilité restante, confirmé par mon propre `npm audit --package-lock-only` sur l'état actuel de `develop`. La CI (`ci.yml`) lance lint + tests à chaque push/PR mais pas d'audit automatique. **Reporté** : ajouter une étape `npm audit --audit-level=high` à la CI.

### 1.2 Vulnérabilités identifiées (classées par famille OWASP Top 10 2021)

| Vulnérabilité constatée                    | Famille(s) OWASP                  | Détail                                                                                                                                             | Statut                                         |
| ------------------------------------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Rôle auto-assignable à l'inscription       | A01(Broken Acess Control)         | Le client pouvait envoyer `"role": "ADMIN"` dans le body de `POST /auth/inscription` et obtenir un compte admin sans validation                    | À anticiper                                    |
| Permissions membre vs admin à finaliser    | A01(Broken Acess Control)         | Une fois la vue membre construite, bien limiter ce qu'un `MEMBER` peut voir/faire par rapport à un `ADMIN`                                         | À anticiper (vue membre pas encore construite) |
| Pas de règle de complexité de mot de passe | A02(Cryptographic failures)       | Bcrypt déjà utilisé pour le hash ; traité par une seule contrainte pour le moment : 8 caractères min., à prévoir décider des contraintes en équipe | Identifié, partiellement traité reporté en V2  |
| Validation des entrées (SQL, email)        | A03(Injection)                    | Requêtes systématiquement paramétrées (`$1, $2…`) dans `tasksModels.js`/`loginModels.js` ; regex de validation sur le champ email côté back        | ✅Vérifié, traité                              |
| CORS ouvert à toute origine                | A05(Security misconfiguration)    | `cors()` sans option autorisait n'importe quel site à appeler l'API                                                                                | Vulnérabilité faible                           |
| Dépendances front vulnérables              | A06(Vulnerable component)         | 3 vulnérabilités high (`brace-expansion`, `nanoid`, `postcss`) trouvées via `npm audit`, voir §1.1                                                 | ✅ Traité (`npm audit fix`)                    |
| Token JWT dans le localStorage             | A07(Auth Failure)                 | Durée de vie 24h, aucune révocation possible, accessible en JS - Privilégier l'utilisation des cookies plutot que du local storage                 | Identifié, reporté                             |
| Risque XSS (vecteur théorique)             | A01 + A07(Injection+Auth failure) | Pas de faille active aujourd'hui, mais deviendrait grave à cause du token en localStorage                                                          | Identifié, reporté                             |

**Rôle auto-assignable à l'inscription (A01) — à anticiper :**

```diff
- const { role, name, mail, tribe_name, password } = req.body;
+ const { name, mail, tribe_name, password } = req.body;
+ // le rôle ne vient jamais du client à l'inscription publique
+ const role = 'MEMBER';
```

Le passage en `ADMIN` devra passer par une action explicite d'un admin existant (pas encore implémenté — à prévoir). Le sujet plus large des permissions membre reste à concevoir lors de la construction de la vue membre (Léa).

**CORS ouvert à toute origine (A05) — vulnérabilité faible :**

```diff
- app.use(cors());
+ const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
+ app.use(cors({ origin: allowedOrigin }));
```

**Mot de passe (A02), token en localStorage (A07) et risque XSS (A05+A07) — reportés** : décider une règle de complexité de mot de passe en équipe (ex. 12 caractères min., majuscule/chiffre) ; pour le token, **solution déjà actée en équipe** : remplacer le `localStorage` par un cookie `httpOnly`

### 1.3 Gestion des secrets

- `.env` gitignoré, jamais committé ; `.env.example` présent et documenté dans le `README.md`.
- Fuite de données :les identifiants de la bdd local ont étaient commités en début de projet attention à bien utiliser les variables d'environnement. `docker-compose.yml` ne contient plus d'identifiants en clair : `backend` et `postgres` lisent tous deux `env_file: ./back/.env`. ✅

### 1.4 Permissions du dépôt

| Rôle (README) | Membre(s)           | Accès GitHub attendu                 |
| ------------- | ------------------- | ------------------------------------ |
| Coordinatrice | Elodie              | Admin/MasterKeySecret                |
| Développeuses | Elodie, Off, Gaédic | Write, pas de push direct sur `main` |

`main` protégée : PR + 2 approbations (règle documentée dans le README).
