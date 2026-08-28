# Documentation technique — Lovelace Family

Documentation technique du projet, générée avec [Docusaurus](https://docusaurus.io/).

Pour installer et lancer **l'application** (frontend, backend, base de données),
voir le [README racine](../README.md). Ce dossier concerne uniquement le site de
documentation.

## Prérequis

Contrairement au reste du projet, la documentation ne tourne **pas** dans Docker.
Elle nécessite [Node.js](https://nodejs.org/) **20 ou supérieur** installé
localement.

## Lancer la documentation en local

```bash
cd documentation
npm install
npm run start
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000) et se
recharge automatiquement à chaque modification d'un fichier `.md`.

## Construire la version statique

```bash
npm run build
npm run serve
```

`npm run build` génère le site dans `documentation/build/` ; `npm run serve` sert
ce dossier pour vérifier le rendu final avant déploiement.

## Contenu

Les pages se trouvent dans `documentation/docs/` :

| Page            | Sujet                                      |
| --------------- | ------------------------------------------ |
| Vue d'ensemble  | objectif du projet, stack, flux principaux |
| Installation    | lancer le projet en local avec Docker      |
| Architecture    | communication entre les trois couches      |
| Back-end        | structure en couches et flux de l'API      |
| Front-end       | structure des composants React             |
| Base de données | schéma des tables                          |
| Contribution    | conventions de branches, commits, CI       |
