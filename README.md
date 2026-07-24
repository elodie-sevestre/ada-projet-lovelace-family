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

---

## 👩‍💻 Organisation d'équipe

| Rôle               | Membre(s)                   |
| ------------------ | --------------------------- |
| Développeuses      | Elodie, Off, Alicia, Gaédic |
| Coordinatrice      | Off                         |
| Animatrice réunion | Gaédic                      |

---

## 🛠️ Outils de suivi

- **Gestion de projet** : https://lovelacefamily.atlassian.net/jira/software/projects/OLC/list?jql=project+%3D+OLC+AND+labels+%3D+v1+ORDER+BY+priority+DESC%2C+created+DESC&atlOrigin=eyJpIjoiZjY5NGRiZGJjMWQzNDFhOWI2NzM1YzRhZWQwNzkwMzUiLCJwIjoiaiJ9

---

## 🌿 Règles de contribution

### Conventions de nommage des branches

Création d'une **nouvelle branche par fonctionnalité, bug ou fix**, selon le format suivant :

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

## 📦 Stack technique

- **JavaScript**
- **React**
- **Node.js / Express**
- **PostgreSQL**

---

## 🚀 Installation

```bash
git clone git@github.com:elodie-sevestre/ada-projet-lovelace-family.git
cd ada-projet-lovelace-family
cp back/.env.example back/.env
docker compose up --build
```

📖 Documentation complète : voir [`documentation/`](./documentation/docs/installation/index.md)

---

## 📈 État d'avancement

- ✅ **Fait** : modélisation et seed de la base de données
- 🔎 **En review** : consultation des tâches (vue globale), modification des tâches, suppression d'une tâche
- 🚧 **En cours** : création et assignation de tâches, consultation des tâches (vue membre)
- 📋 **À venir** : connexion / authentification, validation fonctionnelle d'une tâche, système de gratification
