# Contribution

## Convention de nommage des branches

Une nouvelle branche par fonctionnalité, bug ou fix, au format `préfixe/description_brève` :

| Préfixe    | Usage                         |
| ---------- | ----------------------------- |
| `feature`  | Nouvelle fonctionnalité       |
| `fix`      | Correction de bug             |
| `docs`     | Documentation                 |
| `chore`    | Tâche technique / maintenance |
| `refactor` | Refactorisation de code       |

## Convention de messages de commit

Les commits suivent le format `type: description courte`, en français :

| Type       | Usage                         |
| ---------- | ----------------------------- |
| `feat`     | Nouvelle fonctionnalité       |
| `fix`      | Correction de bug             |
| `docs`     | Documentation                 |
| `chore`    | Tâche technique / maintenance |
| `refactor` | Refactorisation de code       |

Exemples tirés de l'historique du projet :

```
feat: ajout du bouton supprimer et du pop-up de confirmation
fix: correctif seed users : admin to ADMIN
docs: ajout fiche review fonctionnalité supprimer une tâche
```

> ⚠️ Le type utilisé en commit (`feat`) diffère légèrement du préfixe utilisé pour les branches (`feature`) — ne pas confondre les deux conventions.

## Règle de protection de `main`

Une Pull Request est obligatoire avant tout merge sur `main`, après approbation de **deux contributrices**.
