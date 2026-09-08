---
sidebar_position: 1
description: Pour la dev qui rejoint l'équipe. Répond à « comment j'installe et je lance le projet pour la première fois ? ».
---

# Bien démarrer sur Lovelace Family

Ce tutoriel t'accompagne pas à pas pour faire tourner **Lovelace Family** sur ta machine, jusqu'à te connecter dans l'application avec un compte de test. À la fin, tu auras un environnement complet qui fonctionne (frontend, backend, base de données) et tu comprendras ce que fait chaque étape.

Tu n'as besoin d'aucune connaissance préalable du projet pour suivre ce tutoriel — c'est justement l'objectif.

> **💡 Ce que tu vas obtenir à la fin**
>
> Une application accessible dans ton navigateur, avec une base de données déjà remplie de données de test, sur laquelle tu pourras te connecter avec un compte "parent" ou un compte "enfant".

## Avant de commencer

Deux outils doivent être installés sur ta machine :

- **[Git](https://git-scm.com/downloads)** — pour récupérer le code du projet et gérer les branches.
- **[Docker](https://www.docker.com/products/docker-desktop/)** (Docker Desktop) — pour lancer le frontend, le backend et la base de données ensemble, sans avoir à installer Node.js ou PostgreSQL toi-même.

C'est tout l'intérêt de Docker ici : tu n'as rien d'autre à installer. Tous les services tournent dans des conteneurs isolés, préconfigurés pour communiquer entre eux.

## Étape 1 — Cloner le projet

Récupère le code sur ta machine :

```bash
git clone git@github.com:elodie-sevestre/ada-projet-lovelace-family.git
cd ada-projet-lovelace-family
```

Tu te retrouves avec trois dossiers principaux : `back` (le serveur Node.js/Express), `front` (l'interface React), et `db` (tout ce qui concerne PostgreSQL).

## Étape 2 — Préparer le fichier de configuration

Le backend a besoin de connaître certaines informations pour démarrer (comment se connecter à la base de données, quelle clé utiliser pour sécuriser les connexions, etc.). Ces informations vivent dans un fichier `.env`, qui n'est **jamais** versionné dans Git — c'est pour ça qu'un fichier `.env.example` sert de modèle.

Copie ce modèle :

```bash
cp back/.env.example back/.env
```

Ouvre le fichier `back/.env` que tu viens de créer. Tu devrais voir quelque chose comme ceci :

```bash
# Base de données PostgreSQL — obligatoire
POSTGRES_USER=            # à remplir (au choix, en local)
POSTGRES_PASSWORD=        # à remplir (au choix, en local)
POSTGRES_DB=lovelace_db
POSTGRES_HOST=postgres    # nom du service docker-compose
POSTGRES_PORT=5432

# Secret JWT — obligatoire — minimum 32 caractères en production
JWT_SECRET=               # à demander au/à la responsable sécurité, ou à générer en local (voir commande ci-dessous)

# Port d'écoute du serveur — optionnel, défaut 3000
PORT=5000

# Environnement d'exécution — development | production | test
NODE_ENV=development
```

Trois choses à faire ici :

**1. `POSTGRES_USER` et `POSTGRES_PASSWORD`** — Choisis librement n'importe quelles valeurs. En local, il n'y a aucun enjeu de sécurité : c'est simplement l'identifiant/mot de passe que ta base de données Docker utilisera sur ta machine. Par exemple :

```bash
POSTGRES_USER=lovelace
POSTGRES_PASSWORD=devlocal
```

**2. `JWT_SECRET`** — Cette clé sert à signer les jetons de connexion (JWT) des utilisateurs. Pour un usage local, génère la tienne avec cette commande :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Colle la chaîne obtenue comme valeur de `JWT_SECRET`.

> **📌 Pourquoi je ne dois pas inventer n'importe quelle valeur ?**
>
> `POSTGRES_HOST=postgres` n'est **pas** à modifier : ce n'est pas une adresse réseau classique, c'est le nom du service tel qu'il est déclaré dans `docker-compose.yml`. Les conteneurs Docker se parlent entre eux par leur nom de service, pas par `localhost`.

**3. `PORT` et `NODE_ENV`** — Laisse-les tels quels pour l'instant, les valeurs par défaut conviennent parfaitement à un premier lancement en local.

## Étape 3 — Lancer le projet

Une seule commande suffit pour démarrer les trois services (frontend, backend, base de données) :

```bash
docker compose up --build
```

L'option `--build` reconstruit les images Docker — utile la première fois, ou après une modification des dépendances. Laisse tourner cette commande dans ton terminal ; les logs des trois services vont s'afficher au fur et à mesure qu'ils démarrent.

Une fois que les logs se stabilisent (plus de messages d'erreur qui défilent), les trois services sont prêts :

| Service    | Port (local) |
| ---------- | ------------ |
| Frontend   | `5173`       |
| Backend    | `5000`       |
| PostgreSQL | `5432`       |

> **⚠️ Un port est déjà utilisé chez toi ?**
>
> Ne modifie **pas** `docker-compose.yml` pour ça : ce fichier est versionné et partagé par toute l'équipe — le changer changerait la config pour tout le monde dès que tu pousserais ta branche.
>
> La bonne pratique est plutôt de libérer le port en local : identifie quel service tourne déjà sur ce port sur ta machine (par exemple un PostgreSQL déjà installé en local qui occupe le `5432`) et arrête-le, avant de relancer `docker compose up --build`.

## Étape 4 — Vérifier que ça fonctionne

Ouvre ton navigateur à l'adresse [http://localhost:5173](http://localhost:5173). Tu devrais voir l'écran de connexion de Lovelace Family.

Le projet est livré avec deux comptes de démonstration déjà présents en base (via le seed), pour que tu puisses tester sans créer de compte :

| Persona     | Rôle   | Identifiant / Email | Mot de passe |
| ----------- | ------ | -------------------- | ------------- |
| **Bernard** | ADMIN  | bernard@aol.com       | lemotdepasse  |
| **Léa**     | MEMBER | lillychat@gmail.com   | kawai3000     |

Connecte-toi avec le compte **Bernard** : tu arrives sur la vue "parent", avec la liste des tâches déjà créées par le seed. Si tu vois cette liste, c'est que le frontend, le backend et la base de données communiquent correctement entre eux — bravo, ton environnement est opérationnel !

## Alternative — lancer front et back sans Docker

Docker reste la voie recommandée pour ce tutoriel, mais tu peux aussi lancer le frontend et le backend directement en ligne de commande, en gardant uniquement PostgreSQL dans Docker. C'est utile par exemple pour profiter pleinement du serveur de développement Vite pendant que tu travailles sur le front.

**1. Ne démarrer que la base de données via Docker**

```bash
docker compose up postgres
```

Laisse cette commande tourner dans un terminal — seul le conteneur PostgreSQL démarre, pas le frontend ni le backend.

> **⚠️ Une valeur à changer dans ton `.env`**
>
> Dans le tutoriel avec Docker complet, `POSTGRES_HOST=postgres` fonctionne parce que le backend tourne lui aussi dans un conteneur, sur le même réseau Docker. Ici, le backend va tourner directement sur ta machine et devra atteindre PostgreSQL via le port exposé sur ton système : remplace cette valeur par `POSTGRES_HOST=localhost` dans `back/.env`.

**2. Installer les dépendances de chaque service**

```bash
cd back && npm install
cd ../front && npm install
```

**3. Initialiser la base de données**

Depuis le dossier `back`, applique les migrations puis charge les données de test :

```bash
npm run db:migrate:up
npm run db:seed
```

**4. Lancer le backend**

Toujours depuis `back`, dans un second terminal :

```bash
npm run dev
```

**5. Lancer le frontend**

Depuis `front`, dans un troisième terminal :

```bash
npm run dev
```

Vite démarre le frontend sur [http://localhost:5173](http://localhost:5173) avec le rechargement à chaud — retrouve-toi à l'[étape de vérification](#étape-4--vérifier-que-ça-fonctionne) ci-dessus pour te connecter avec un compte de test.

## Ce que tu viens de faire

Récapitulons ce qui s'est passé pendant ce tutoriel :

1. Tu as récupéré le code source du projet.
2. Tu as configuré les variables d'environnement dont le backend a besoin pour se connecter à la base et sécuriser les jetons de connexion.
3. Docker Compose a construit et démarré trois conteneurs (frontend, backend, PostgreSQL) qui communiquent entre eux par leurs noms de service.
4. Tu as vérifié que tout fonctionnait en te connectant avec un compte de test.

## Et maintenant ?

Ce tutoriel t'a fait démarrer une fois. Pour la suite de ton travail au quotidien sur le projet, tu n'auras plus besoin de ces explications détaillées — tu iras directement chercher la commande dont tu as besoin :

- **[Relancer le projet en local](../guides/lancer-le-projet-en-local.md)** — pour les fois suivantes, sans le détail pédagogique.
- **[Initialiser ou réinitialiser la base de données](../guides/initialiser-la-bdd.md)** — si tu dois repartir d'un état propre.
- **[Contribuer au projet](../guides/contribuer.md)** — conventions de branches, workflow `develop`/`main`, Pull Requests.

Si tu veux comprendre le *pourquoi* des choix techniques (pourquoi PostgreSQL, pourquoi cette architecture), direction la section **Explications**.