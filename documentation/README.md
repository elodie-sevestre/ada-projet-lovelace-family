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

Les pages se trouvent dans `documentation/docs/`, organisées selon le cadre
[Diátaxis](https://diataxis.fr/) : chaque fichier répond à un seul besoin.

| Quadrant           | Dossier          | Contenu                                                             |
| ------------------ | ---------------- | ------------------------------------------------------------------ |
| Tutoriels          | `tutoriels/`     | prise en main guidée, du clone à la première tâche validée         |
| Guides pratiques   | `guides/`        | lancer le projet, initialiser la base, lancer les tests, contribuer, runbook |
| Référence          | `reference/`     | API HTTP, structure back, structure front, schéma BDD, conventions |
| Explications       | `explications/`  | architecture, flux applicatifs, gestion d'état front, limites, ADR |

Règle : une modification de code qui rend la doc fausse doit être corrigée dans
la même Pull Request. Le build (`npm run build`) échoue sur lien mort
(`onBrokenLinks: "throw"`).
