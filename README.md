# 🏠 Lovelace Family

> Application de gestion de tâches familiale — fun et gamifiée.

---

## 📋 Description

**Lovelace Family** est une application de gestion de tâches entre membres de la famille.
L'application est fun et gamifiée pour donner envie de participer.
Elle s'adresse aux **parents** et à leurs **enfants**.

---

## ✨ Fonctionnalités principales — V1

- 🔐 Connexion
- ➕ Création de tâche
- 👤 Assignation de tâche
- 👁️ Visualisation des tâches
- ✅ Validation des tâches
- ✏️ Modification des tâches
- 🗑️ Suppression de tâche
- 🚪 Déconnexion
- 🏆 Gamification (célébration à la validation)

---

## 👩‍💻 Organisation d'équipe

| Rôle               | Membre(s)           |
| ------------------ | ------------------- |
| Développeuses      | Elodie, Off, Gaédic |
| Coordinatrice      | Off                 |
| Animatrice réunion | Gaédic              |

---

## 🛠️ Outils de suivi

- **Gestion de projet** : [Jira-Lovelace-Family](https://lovelacefamily.atlassian.net/jira/software/projects/OLC/list?jql=project+%3D+OLC+AND+labels+%3D+v1+ORDER+BY+priority+DESC%2C+created+DESC&atlOrigin=eyJpIjoiZjY5NGRiZGJjMWQzNDFhOWI2NzM1YzRhZWQwNzkwMzUiLCJwIjoiaiJ9)

---

## 📦 Stack technique

- **JavaScript**
- **React**
- **Node.js / Express**
- **PostgreSQL**
- **Docker / Docker Compose**

---

## 📚 Documentation technique

La documentation détaillée (architecture, API, flux, décisions techniques) est un
site [Docusaurus](https://docusaurus.io/) dans le dossier [`documentation/`](./documentation/),
organisé selon le cadre [Diátaxis](https://diataxis.fr/) :

- **Tutoriels** — prise en main guidée
- **Guides pratiques** — lancer le projet, initialiser la base, contribuer, runbook
- **Référence** — API HTTP, structure back / front, schéma BDD, conventions
- **Explications** — architecture, flux applicatifs, ADR, limites connues

```bash
cd documentation
npm install
npm run start
```

---

## ✅ Prérequis

Avant de cloner le projet, assurez-vous d'avoir installé sur votre machine :

- **[Git](https://git-scm.com/downloads)** — pour cloner le dépôt et gérer les branches
- **[Docker](https://www.docker.com/products/docker-desktop/)** — pour lancer l'ensemble des services (frontend, backend, base de données) sans avoir à tout installer localement.

---

## 🌿 Workflow Git & Règles de contribution

### Les branches `develop` et `main`

Le projet fonctionne avec deux branches de référence :

- **`develop`** : branche d'intégration continue. C'est ici que l'on pousse (via Pull Request) tout au long du sprint, au fur et à mesure de l'avancement des fonctionnalités.
- **`main`** : branche stable de production. Elle n'est mise à jour qu'en fin de version (par exemple à la fin de la V1), une fois que `develop` a été validée et testée.
  En résumé : on développe et on merge sur `develop` pendant le sprint, et on merge `develop` vers `main` uniquement lors de la livraison d'une version.

### Conventions de nommage des branches

Création d'une **nouvelle branche par fonctionnalité, bug ou fix**, à partir de `develop`, selon le format suivant :

```
préfixe/description_breve
```

**Préfixes retenus :**

| Préfixe    | Usage                         |
| ---------- | ----------------------------- |
| `feature`  | Nouvelle fonctionnalité       |
| `fix`      | Correction de bug             |
| `docs`     | Documentation                 |
| `chore`    | Tâche technique / maintenance |
| `refactor` | Refactorisation de code       |

### Protection de la branche `main`

> ⚠️ Une **Pull Request** est obligatoire avant tout merge sur `main`,
> après **approbation de deux contributrices**.

---

## 🚀 Installation

```bash
git clone git@github.com:elodie-sevestre/ada-projet-lovelace-family.git
cd ada-projet-lovelace-family
cp back/.env.example back/.env
```

### 🔑 Récupération des variables d'environnement

Le fichier `.env.example` liste les variables nécessaires, mais certaines valeurs sensibles ne doivent **pas** être inventées ni versionnées :

- Demandez le **secret JWT** (`JWT_SECRET`) à **[Elodie]**, qui centralise cette information pour l'équipe.
- Pour un usage **local uniquement**, vous pouvez générer votre propre clé avec la commande suivante :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

- Les identifiants de base de données (`POSTGRES_USER`, `POSTGRES_PASSWORD`) peuvent être choisis librement par la personne qui installe le projet en local — il n'y a pas d'enjeu de sécurité à ce niveau tant que ce n'est pas un environnement de staging/production.

#### Contenu du `.env.example`

```bash
# Base de données PostgreSQL — obligatoire
POSTGRES_USER=            # à remplir (au choix, en local)
POSTGRES_PASSWORD=        # à remplir (au choix, en local)
POSTGRES_DB=lovelace_db
POSTGRES_HOST=postgres    # nom du service docker-compose
POSTGRES_PORT=5432

# Secret JWT — obligatoire — minimum 32 caractères en production
JWT_SECRET=               # à demander au/à la responsable sécurité, ou à générer en local (voir commande ci-dessus)

# Port d'écoute du serveur — optionnel, défaut 3000
PORT=5000

# Environnement d'exécution — development | production | test
NODE_ENV=development
```

> 🧠 **Règle mentale à retenir** : dans un `.env.example`, on **vide** ce qui est secret (mots de passe, clés) et on **renseigne** ce qui est imposé mais public (noms de service, ports par défaut, config technique). C'est l'inverse d'un `.env` classique, appliqué dans le même esprit : on documente sans exposer.

### ▶️ Lancer le projet

```bash
docker compose up --build
```

---

## 🌐 Ports des services

| Service    | Port (local) |
| ---------- | ------------ |
| Frontend   | `5173`       |
| Backend    | `5000`       |
| PostgreSQL | `5432`       |

> ⚠️ À adapter si ces ports sont déjà utilisés sur votre machine (modifiable dans le `docker-compose.yml` et le `.env`).

---

## 🐘 Configuration PostgreSQL

**1. Installer une extension PostgreSQL sur VSCode (optionnel mais recommandé)**

Dans VS Code, installez une extension type _PostgreSQL_ (ex. par Chris Kolkman ou Weijan Chen) pour explorer visuellement les tables et exécuter des fichiers `.sql` directement depuis l'éditeur.

**2. Se connecter manuellement à la base via `psql` grâce à l'onglet Exec sur Docker Desktop (pas à pas)**

Si vous n'utilisez pas VS Code (ou son extension PostgreSQL), vous pouvez remplir la base directement via Docker, en exécutant vos fichiers `.sql` (structure + seed) à la main.

1. Ouvrez **Docker Desktop**.
2. Repérez le conteneur **postgres** en cours d'exécution.
3. Cliquez sur l'onglet **Exec** (ou "Terminal") du conteneur pour ouvrir une invite de commande à l'intérieur.
4. Connectez-vous à la base avec :

```bash
psql -U id_user -d nom_db
```

(remplacez `id_user` par la valeur de `POSTGRES_USER` et `nom_db` par la valeur de `POSTGRES_DB`)

5. Vous pouvez ensuite coller vos requêtes SQL directement dans le terminal `psql`.

---

## 👥 Utilisateurs de test

Pour tester l'application sans passer par la création de compte, deux comptes de démonstration sont pré-chargés via le seed :

| Persona     | Rôle   | Identifiant / Email | Mot de passe |
| ----------- | ------ | ------------------- | ------------ |
| **Bernard** | ADMIN  | bernard@aol.com     | lemotdepasse |
| **Léa**     | MEMBER | lillychat@gmail.com | kawai3000    |

> 📌 À compléter avec les valeurs réelles du fichier de seed dès qu'il sera finalisé.

---

## 📈 État d'avancement

- ✅ **Fait** : modélisation de la base de données, seed BDD, consultation des tâches (vue Bernard), création et assignation de tâches, suppression d'une tâche
- 🔎 **En review** : modification des tâches
- 🚧 **En cours** : connexion / authentification, consultation des tâches (vue Léa / membre), validation fonctionnelle d'une tâche
- 📋 **À venir** : retour positif à la validation / système de gratification
