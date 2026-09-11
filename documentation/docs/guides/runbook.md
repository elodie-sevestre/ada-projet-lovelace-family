---
sidebar_position: 5
description: Pour la personne qui intervient quand ça casse, sans forcément connaître le code. Répond à « le service est cassé, qu'est-ce que je fais ? ».
---

# Runbook

Procédures à suivre telles quelles, dans l'ordre. Prescriptif : le _pourquoi_ est dans les [Explications](../explications/architecture.md).

:::warning
Ce runbook est un point de départ, adapté à l'environnement local Docker Compose. Chaque incident réel est l'occasion de le corriger.
:::

## Le backend ne répond plus

À utiliser quand l'application ne répond plus sur [http://localhost:5173](http://localhost:5173) ou que l'API ne répond plus sur `:5000`.

1. Vérifier que PostgreSQL répond :

```bash
   docker compose exec -T postgres psql -U "$POSTGRES_USER" -d lovelace_db -c "SELECT 1"
```

Si échec → passer à la section [La base de données ne répond plus](#la-base-de-données-ne-répond-plus).

2. Lire les derniers logs du backend :

```bash
   docker compose logs --tail 100 backend
```

3. Redémarrer le backend :

```bash
   docker compose restart backend
```

Attendre ~10 s, recharger la page, puis rejouer la requête `SELECT 1` ci-dessus pour confirmer. 4. Si le service ne repart toujours pas :

- vérifier `back/.env` (voir la Référence — Variables d'environnement) ;
- vérifier qu'aucun autre processus n'occupe le port `5000` ;
- vérifier que le schéma est bien en place, sinon [rejouer les migrations](./initialiser-la-bdd.md).

## La base de données ne répond plus

1. État du conteneur : `docker compose ps postgres`
2. Logs : `docker compose logs --tail 100 postgres`
3. Redémarrer : `docker compose restart postgres`
4. Vérifier que le healthcheck du service `postgres` passe au vert dans `docker compose ps` — le backend attend ce signal pour démarrer.
5. Toujours bloqué après 5 minutes ? Voir [Escalade](#escalade).

## Rien ne fonctionne, tout réinitialiser

```bash
docker compose down -v   # -v supprime aussi le volume de la base
docker compose up --build
```

Puis [réinitialiser la base](./initialiser-la-bdd.md).

## Escalade

Non résolu en 30 minutes : prévenir l'équipe.
