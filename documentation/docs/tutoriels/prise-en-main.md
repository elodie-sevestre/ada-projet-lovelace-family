---
sidebar_position: 1
description: Pour la dev qui rejoint l'équipe. Répond à « comment je lance le projet et je fais une première tâche de bout en bout ? ».
---

# Prise en main

Objectif : partir d'un dépôt fraîchement cloné et arriver à créer puis valider une tâche dans l'application. Compte 15 minutes.

Ce tutoriel te fait suivre un chemin balisé, sans décision à prendre. Pour le détail de chaque commande, les [guides pratiques](../guides/lancer-le-projet-en-local.md) prennent le relais.

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Docker Compose est inclus)
- [Git](https://git-scm.com/downloads)

Node.js n'est **pas** nécessaire : le frontend et le backend tournent dans des conteneurs.

## 1. Récupérer le projet

```bash
git clone git@github.com:elodie-sevestre/ada-projet-lovelace-family.git
cd ada-projet-lovelace-family
cp back/.env.example back/.env
```

## 2. Renseigner le `.env`

Ouvre `back/.env` et remplis les deux valeurs laissées vides :

- `POSTGRES_USER` et `POSTGRES_PASSWORD` : choisis ce que tu veux, ce sont des identifiants locaux sans enjeu.
- `JWT_SECRET` : pour un usage local, génère une clé avec

  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

  (pour un environnement partagé, demande la vraie clé à Elodie).

Les autres variables (`POSTGRES_DB`, `POSTGRES_HOST`, `POSTGRES_PORT`, `PORT`, `NODE_ENV`) sont déjà renseignées, n'y touche pas.

## 3. Démarrer les services

```bash
docker compose up --build
```

Trois services démarrent : `frontend` (port `5173`), `backend` (`5000`), `postgres` (`5432`). Le backend attend que PostgreSQL soit prêt (`healthcheck`) avant de se lancer.

## 4. Initialiser la base

La base démarre vide. Charge le schéma et les données de test en suivant [Initialiser la base de données](../guides/initialiser-la-bdd.md). Le seed crée notamment deux comptes de démonstration.

## 5. Ouvrir l'application et se connecter

Va sur [http://localhost:5173](http://localhost:5173). L'écran de connexion s'affiche.

Connecte-toi avec le compte **ADMIN** de démonstration (voir la table des [utilisateurs de test](../guides/initialiser-la-bdd.md#utilisateurs-de-test)). Le formulaire appelle `POST /auth/connexion`, stocke le token JWT reçu dans le `localStorage`, et affiche la vue des tâches.

## 6. Créer une tâche

En tant qu'ADMIN, le bouton **＋** ouvre la modale de création. Renseigne un nom, un nombre de points, un membre assigné, valide : la tâche apparaît dans la colonne « À faire ».

## 7. Valider la tâche

Coche la case de la tâche. Son statut passe à `TERMINE`, une animation et un son de célébration se déclenchent, et la tâche bascule dans « Terminées ».

## Et ensuite ?

- Comprendre ce qui s'est passé côté serveur → [Flux applicatifs](../explications/flux-applicatifs.md)
- Comprendre l'architecture d'ensemble → [Architecture](../explications/architecture.md)
- Modifier le code et contribuer → [Contribuer](../guides/contribuer.md)
