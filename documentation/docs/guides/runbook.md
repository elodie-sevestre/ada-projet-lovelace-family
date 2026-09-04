---
sidebar_position: 5
description: Pour la personne qui intervient quand ça casse, sans forcément connaître le code. Répond à « le service est cassé, qu'est-ce que je fais ? ».
---

# Runbook

Procédures à suivre telles quelles, dans l'ordre. Prescriptif : le *pourquoi* est dans les [Explications](../explications/architecture.md).

:::warning
Ce runbook est un point de départ, adapté à l'environnement local Docker Compose. Chaque incident réel est l'occasion de le corriger. Un runbook non testé ne vaut rien.
:::

## Redémarrer le backend après un plantage

À utiliser quand l'application ne répond plus sur [http://localhost:5173](http://localhost:5173) ou que l'API ne répond plus sur `:5000`.

1. Vérifier que PostgreSQL répond :
   ```bash
   docker compose exec -T postgres psql -U "$POSTGRES_USER" -d lovelace_db -c "SELECT 1"
   ```
   Si échec → le problème est la base, voir la section suivante.
2. Lire les derniers logs du backend :
   ```bash
   docker compose logs --tail 100 backend
   ```
3. Redémarrer le backend :
   ```bash
   docker compose restart backend
   ```
   Attendre ~10 s, puis recharger la page.
4. Si le service ne repart pas :
   - vérifier `back/.env` (voir [Référence](../reference/backend.md#variables-denvironnement)) ;
   - vérifier qu'aucun autre processus n'occupe le port `5000` ;
   - vérifier que le schéma est bien en place, sinon [rejouer les migrations](./initialiser-la-bdd.md).

## « La base de données ne répond plus »

1. État du conteneur : `docker compose ps postgres`
2. Logs : `docker compose logs --tail 100 postgres`
3. Redémarrer : `docker compose restart postgres`
4. Le backend refuse toujours de démarrer ? Vérifier le `healthcheck` du service `postgres` dans `docker-compose.yml` : le backend attend qu'il passe au vert.

## « Les requêtes sont lentes »

1. Repérer l'endpoint lent (logs backend, onglet Réseau du navigateur).
2. Rejouer la requête SQL correspondante à la main (`db/queries.sql`) pour distinguer lenteur SQL et lenteur applicative.
3. Vérifier la charge des conteneurs : `docker stats`.

## Repartir d'un environnement propre

```bash
docker compose down -v   # -v supprime aussi le volume de la base
docker compose up --build
```

Puis [réinitialiser la base](./initialiser-la-bdd.md).

## Escalade

Non résolu en 30 minutes : prévenir l'équipe sur le canal projet.
