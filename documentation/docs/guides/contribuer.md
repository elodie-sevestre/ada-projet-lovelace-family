---
sidebar_position: 4
description: Pour toute personne qui veut proposer une modification. Répond à « comment je contribue au projet ? ».
---

# Contribuer

## Branches de référence

- **`develop`** — branche d'intégration. On y pousse (via Pull Request) tout au long du sprint.
- **`main`** — branche stable de production. Mise à jour seulement en fin de version, une fois `develop` validée et testée.

## Le circuit

1. Crée une branche depuis `develop`, au format `préfixe/description_breve` (voir les [conventions de nommage](../reference/conventions.md#convention-de-nommage-des-branches)).
2. Fais tes commits au format `type: description courte`, en français (voir les [conventions de commit](../reference/conventions.md#convention-de-messages-de-commit)).
3. Ouvre une Pull Request vers `develop`. La CI (`lint` + `test` sur `back/`) doit passer.
4. Un merge vers `main` exige une Pull Request approuvée par **deux contributrices**.

> Ne pas merger une PR dont la CI est en échec.

## Suivi

La gestion des tickets se fait sur [Jira](https://lovelacefamily.atlassian.net/jira/software/projects/OLC/list).

## Documentation

La documentation vit dans le dépôt (`documentation/`) et suit le même circuit : une modification de code qui rend la doc fausse doit être corrigée **dans la même PR**.

Elle est organisée selon [Diátaxis](https://diataxis.fr/) : place chaque ajout dans le bon quadrant.

- **Tutoriel** — parcours guidé pour apprendre.
- **Guide pratique** — recette orientée tâche.
- **Référence** — description factuelle (endpoints, variables, schéma).
- **Explication** — le *pourquoi* (architecture, décisions).

Test rapide : si tu ne peux pas écrire en une phrase *à qui s'adresse ce fichier et à quelle question il répond*, c'est qu'il mélange deux quadrants.
