# Fiche pédagogique — Mise en place de `updateTask` dans le backend

## Objectif

Comprendre comment sécuriser le flux complet de modification d'une tâche, à travers les quatre couches de l'application : **route → controller → service → model**, en respectant une contrainte d'équipe : pas de middleware centralisé pour la gestion d'erreurs.

---

## 1. Rappel de l'architecture en couches

| Couche         | Rôle                                                                        | Ne doit PAS contenir |
| -------------- | --------------------------------------------------------------------------- | -------------------- |
| **Route**      | Définit l'URL et la méthode HTTP, appelle le controller                     | Logique métier, SQL  |
| **Controller** | Gère la requête HTTP (`req`/`res`), extrait les données, appelle le service | Logique métier, SQL  |
| **Service**    | Contient la logique métier (règles, calculs, validations complexes)         | SQL direct           |
| **Model**      | Accès aux données uniquement (requêtes SQL)                                 | Logique métier       |

**Pourquoi cette séparation compte pour la gestion d'erreurs** : sans middleware centralisé, chaque couche doit gérer ses propres erreurs à son niveau, en ajoutant du contexte avant de relancer l'erreur vers la couche du dessus. C'est cette chaîne de contexte qui remplace ce qu'un middleware aurait fait automatiquement.

---

## 2. Les deux familles d'erreurs

Il faut distinguer deux natures de problèmes, qui ne se traitent pas pareil :

1. **Erreur de donnée invalide** (champ manquant, format incorrect, valeur hors enum) → détectée **avant** d'aller en base, dans le **controller**, avec un simple `if` qui renvoie directement un code 400.
2. **Erreur technique** (connexion DB perdue, requête SQL qui échoue, contrainte de clé étrangère violée) → interceptée avec un `try/catch`, dans le **model** ou le **service**, puis relancée avec `throw`.

---

## 3. `throw` : ce que c'est et comment ça circule

`throw` signifie "je lance une alerte, quelqu'un d'autre plus haut va l'attraper avec un `catch`".

```javascript
} catch (error) {
  throw new Error(`Message clair : ${error.message}`);
}
```

Deux choix possibles dans un `catch` :

- `throw new Error("mon message")` → tu remplaces le message, mais tu perds le détail technique original.
- ``throw new Error(`mon message : ${error.message}`)`` → tu gardes les deux (recommandé : utile pour déboguer sans perdre en clarté).

L'erreur remonte comme une bulle : du `model` → au `service` → au `controller`, où le `catch` final la transforme en réponse HTTP (`res.status(500).json(...)`).

---

## 4. Ordre de correction retenu, et pourquoi

L'ordre n'est pas arbitraire : on corrige d'abord ce qui **cache** les erreurs, puis ce qui **empêche les dégâts silencieux sur les données**, et en dernier ce qui **empêche les erreurs d'entrer**.

1. **`usersTasksModel.js`** — le `catch` vide en premier. Tant qu'il masque les erreurs, impossible de vérifier que le reste fonctionne.
2. **`tasksServices.js`** — vérifier le résultat de `updateTaskDetailsModel` avant d'appeler `updateTaskAssignedUserModel`. Protège l'intégrité des données (pas d'assignation sur une tâche inexistante).
3. **`tasksModels.js`** — s'assurer que `updateTaskDetailsModel` renvoie une info exploitable (et pas juste `undefined` silencieux).
4. **`tasksControllers.js`** — validation des entrées utilisateur. C'est la couche la plus visible, mais la moins urgente techniquement : une donnée mal formée qui passerait le controller serait de toute façon interceptée par les corrections faites en amont.

---

## 5. Le cas `usersTasksModel.js` : pourquoi une transaction

### Le problème

Cette fonction fait deux actions liées : `DELETE` (enlever l'ancien utilisateur assigné) puis `INSERT` (assigner le nouveau). Sans protection, si le `DELETE` réussit mais que l'`INSERT` échoue juste après, la tâche se retrouve sans utilisateur assigné du tout.

Ce n'est pas théorique : la table `users_tasks` a une contrainte de clé étrangère sur `user_id` (`fk_users`). Un `user_id` invalide fait planter l'`INSERT`, alors que le `DELETE` d'avant a déjà été appliqué.

### La solution : une transaction

| Mot-clé    | Signification                                                                |
| ---------- | ---------------------------------------------------------------------------- |
| `BEGIN`    | Démarre un bloc : les requêtes suivantes doivent réussir ou échouer ensemble |
| `COMMIT`   | Valide le bloc pour de vrai, si tout s'est bien passé                        |
| `ROLLBACK` | Annule tout ce qui a été fait depuis `BEGIN`, si une requête a échoué        |

**Point technique important** : une transaction doit passer par une **connexion unique** du début à la fin (`client = await pool.connect()`), pas par `pool.query()` qui prend une connexion différente à chaque appel.

```javascript
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query(`DELETE FROM users_tasks WHERE task_id=$1`, [task_id]);
  await client.query(
    `INSERT INTO users_tasks (task_id, user_id) VALUES ($1, $2)`,
    [task_id, user_id],
  );
  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
  throw new Error(
    `Impossible de changer l'utilisateur de la tâche : ${error.message}`,
  );
} finally {
  client.release(); // rendre la connexion, dans tous les cas
}
```

**Pourquoi une transaction ici précisément** : deux requêtes dépendantes, pas une seule. Une requête isolée ne peut pas se retrouver "à moitié faite" — c'est le fait d'en avoir deux liées qui crée le risque.

**Point de vigilance sur le schéma** : la table `users_tasks` n'a pas de contrainte `UNIQUE (task_id)`. Rien n'empêche donc d'avoir plusieurs lignes pour la même tâche. C'est pour ça que le pattern `DELETE + INSERT` est conservé plutôt qu'un simple `UPDATE` (qui suppose qu'une seule ligne existe déjà par tâche — hypothèse non garantie par le schéma actuel).

---

## 6. Le cas `tasksServices.js` : la règle métier entre les deux models

```javascript
const updateTaskService = async (task_id, task_details) => {
  const resultTaskDetails = await updateTaskDetailsModel(task_id, task_details);
  if (!resultTaskDetails) {
    throw new Error(`La tâche ${task_id} n'existe pas`);
  }
  await updateTaskAssignedUserModel(task_id, task_details);
  return resultTaskDetails;
};
```

Ce n'est pas un `try/catch`, c'est une **règle métier** : _"si la mise à jour de la tâche a échoué, ne pas assigner l'utilisateur"_. Ça correspond exactement au rôle du service (logique métier, appelle les models) — ce n'est pas une exception à la convention "gestion d'erreur dans controller/model uniquement", c'est un `if` de contrôle de flux qui appartient naturellement à cette couche.

---

## 7. Le cas `tasksModels.js` : distinguer "0 ligne" et "vraie erreur"

Deux situations différentes à ne pas confondre :

- **"0 ligne modifiée"** (le `task_id` n'existe pas) : ce n'est **pas** une erreur SQL. PostgreSQL exécute la requête normalement, il ne trouve juste rien à modifier. La fonction renvoie `undefined`, et c'est le `if (!resultTaskDetails)` du service qui gère ce cas.
- **Vraie erreur technique** (connexion perdue, valeur invalide pour l'enum `status`) : ça, ça mérite un `try/catch` avec message clair, pour rester cohérent avec `usersTasksModel.js`.

```javascript
const updateTaskDetailsModel = async (task_id, task_details) => {
  try {
    const { name, description, status, points } = task_details;
    const { rows } = await pool.query(
      `UPDATE tasks SET (name,description,status,points) = ($1, $2, $3::status, $4) WHERE id=$5 RETURNING *`,
      [name, description, status, points, task_id],
    );
    return rows[0]; // undefined si aucune tâche ne correspond — géré par le service, pas ici
  } catch (error) {
    throw new Error(`Impossible de modifier la tâche : ${error.message}`);
  }
};
```

---

## 8. Le cas `tasksControllers.js` : la validation des entrées

### Piège classique : `&&` et `||` mal utilisés

Une erreur fréquente est de combiner plusieurs conditions sur la même variable sans tester à la main ce que ça donne pour chaque valeur possible.

**Méthode pour éviter ce piège** : pour chaque condition écrite, tester mentalement (ou sur papier) chaque valeur possible (`"A_FAIRE"`, `"TERMINE"`, `undefined`, `""`, `"BANANE"`...), et vérifier que le résultat correspond à ce qui est voulu.

**Bonne pratique pour valider une valeur parmi une liste autorisée** :

```javascript
const validStatuses = ["A_FAIRE", "TERMINE"];
if (!validStatuses.includes(status)) {
  return res
    .status(400)
    .json({ error: "La valeur du statut n'est pas valide !" });
}
```

`includes()` évite d'avoir à combiner des `!==` avec des `&&`/`||`, source d'erreurs de logique.

### Liste des contrôles mis en place

| Champ         | Statut                         | Contrôle                                            |
| ------------- | ------------------------------ | --------------------------------------------------- |
| `id` (params) | Obligatoire                    | Doit être un entier valide                          |
| `name`        | Obligatoire (NOT NULL en base) | Non vide après `.trim()`                            |
| `description` | Optionnel                      | Si fourni, doit être une chaîne de caractères       |
| `status`      | Obligatoire                    | Doit faire partie de `["A_FAIRE", "TERMINE"]`       |
| `points`      | Optionnel                      | Si fourni, doit être un entier (`Number.isInteger`) |
| `user_id`     | Optionnel                      | Si fourni, doit être un entier                      |

**Point d'attention non résolu** : les contrôles `Number.isInteger` supposent que le frontend envoie de vrais nombres, pas des chaînes de caractères (`5` et non `"5"`). À vérifier une fois le frontend d'update écrit, via l'onglet Network des DevTools.

---

## 9. Nettoyage du code mort

Un bloc de code commenté sans fonctionnalité prévue derrière (ex. `updateTaskUserAssignedController`, une route séparée jamais implémentée) doit être supprimé, pas laissé "au cas où". Une coéquipière qui le lit ne peut pas deviner s'il s'agit d'une fonctionnalité oubliée ou de code obsolète — la suppression lève l'ambiguïté.

---

## 10. Points à tester avant de considérer le travail terminé

- [ ] Tester un `user_id` invalide → vérifier que le `ROLLBACK` annule bien le `DELETE` déjà exécuté
- [ ] Tester un `task_id` inexistant sur `PUT /:id` → vérifier la réponse (le service doit `throw` avant d'appeler `updateTaskAssignedUserModel`)
- [ ] Tester un `status` hors des deux valeurs autorisées → vérifier le message 400
- [ ] Une fois le frontend écrit : vérifier dans les DevTools que `points` et `user_id` arrivent bien en `number` et non en `string`
- [ ] Vérifier le comportement de `ROLLBACK` appelé avant `BEGIN` (cas où un contrôle d'existence de tâche serait ajouté avant la transaction)

---

## Vocabulaire clé

- **`throw`** : lance une erreur, à charge pour un `catch` plus haut de l'attraper
- **`try/catch`** : bloc qui tente une action et récupère l'erreur si elle échoue
- **Transaction (`BEGIN`/`COMMIT`/`ROLLBACK`)** : regroupe plusieurs requêtes SQL pour qu'elles réussissent ou échouent toutes ensemble
- **`client` vs `pool`** : `pool` distribue des connexions différentes à chaque appel ; `client` réserve une connexion unique, nécessaire pour une transaction
- **Erreur opérationnelle vs erreur de programmation** : une donnée invalide (attendue, à gérer proprement) vs un bug (à corriger dans le code)
