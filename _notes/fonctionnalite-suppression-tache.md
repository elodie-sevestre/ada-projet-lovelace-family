# Fonctionnalité : suppression d'une tâche (sans authentification)

> Fiche pédagogique — à utiliser comme support de review de code.
> Portée : suppression d'une tâche par un ADMIN, sans vérification d'authentification/rôle côté serveur (limitation connue, voir fin de fiche).

## 1. Vue d'ensemble

La fonctionnalité relie 4 couches, du clic utilisateur jusqu'à la base de données :

```
Clic "Supprimer" (front)
  → DeleteTaskButton        (ouvre une modal de confirmation)
  → DeleteConfirmModal       (appelle l'API au clic sur "Confirmer")
  → api/tasks.js : deleteTask (fait la requête HTTP DELETE)
  → api/client.js : del       (fetch générique)
        │
        ▼  HTTP DELETE /api/tasks/:id
back/src/routes/tasksRoutes.js         (route)
  → controllers/tasksControllers.js    (validation + code HTTP)
  → services/tasksServices.js          (logique métier)
  → models/tasksModels.js              (requête SQL)
```

Chaque couche a une seule responsabilité : le contrôleur ne parle jamais SQL, le modèle ne connaît jamais `req`/`res`. C'est ce découpage qu'il faut vérifier en review.

## 2. Backend

### 2.1 Route — `back/src/routes/tasksRoutes.js`

```js
tasksRoutes.delete("/:id", deleteTaskController);
```

Une suppression est modélisée par le verbe HTTP `DELETE` sur l'URL de la ressource ciblée (`/tasks/:id`), conformément aux conventions REST. On ne crée pas de route dédiée type `/tasks/delete/:id`.

### 2.2 Contrôleur — `back/src/controllers/tasksControllers.js`

```js
const deleteTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({ error: "L'identifiant non valide !" });
    }
    const rows = await deleteTaskService(id);
    if (rows === false) {
      return res.status(404).json({ error: "Ressource introuvable..." });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Suppression impossible !" });
  }
};
```

Points à retenir pour la review :
- **Validation de l'id avant tout appel au service** : évite d'interroger la base avec une valeur non exploitable.
- **Distinction des cas d'échec** : id invalide → `400`, tâche déjà inexistante → `404`, erreur technique imprévue → `500`.
- **`204 No Content` sur succès** : c'est le code HTTP standard pour un DELETE réussi qui ne renvoie pas de corps de réponse (contrairement à un POST/PUT qui renvoie la ressource créée/modifiée).

### 2.3 Service — `back/src/services/tasksServices.js`

```js
const deleteTaskService = async (task_id) => {
  const rows = await deleteTaskModel(task_id);
  if (!rows) {
    return false;
  }
  return true;
};
```

Le service traduit le résultat technique du modèle (`undefined`/ligne supprimée) en une information métier simple (`true`/`false`) que le contrôleur peut interpréter sans connaître le détail SQL.

### 2.4 Modèle — `back/src/models/tasksModels.js`

```js
const deleteTaskModel = async (task_id) => {
  const { rows } = await pool.query(
    `DELETE FROM tasks WHERE id=$1 RETURNING *`,
    [task_id],
  );
  return rows[0];
};
```

- **Requête paramétrée** (`$1` + tableau de valeurs) : protège contre les injections SQL, ne jamais concaténer `task_id` directement dans la chaîne SQL.
- **`RETURNING *`** : permet de savoir si une ligne a réellement été supprimée (si l'id n'existe pas, `rows` est vide et `rows[0]` vaut `undefined`), sans avoir à faire un `SELECT` séparé avant le `DELETE`.

### 2.5 Limitation connue (à surveiller en review)

```js
const deleteTaskModel = async (task_id) => {
  //todo vérifier le rôle de l'utilisateur ds services (authentification ?)
  // si ADMIN : suppresion OK
  // si MEMBRE : REFUSE
  ...
```

**Aucune vérification d'authentification ni de rôle côté serveur.** N'importe qui connaissant l'URL et l'id peut supprimer une tâche via une requête HTTP directe (Postman, curl...), même si le bouton n'est visible côté front que pour un `ADMIN`. Le contrôle d'accès front (`isAdmin` dans `TaskItem`) est un confort d'UX, pas une sécurité : il doit être doublé d'une vérification serveur avant mise en production.

## 3. Frontend

### 3.1 Couche API

`front/src/api/client.js` expose une fonction générique pour les appels DELETE :

```js
export function del(url) {
  return request(url, { method: "DELETE" });
}
```

`front/src/api/tasks.js` l'utilise pour construire l'appel spécifique à une tâche :

```js
export function deleteTask(id) {
  const taskUrl = TASKS_ROUTE + "/" + String(id);
  return del(taskUrl);
}
```

Séparer `client.js` (générique, connaît le protocole HTTP) de `tasks.js` (métier, connaît les routes de l'app) permet de réutiliser `del`/`get`/`post`/`put` pour n'importe quelle ressource future.

### 3.2 `DeleteTaskButton.jsx` — déclenche l'ouverture de la confirmation

```jsx
const DeleteTaskButton = ({ task, onDelete }) => {
  return (
    <button
      type="button"
      aria-label={`Suppression de la tâche ${task.task_name}`}
      className="delete-button"
      onClick={() => onDelete(task)}
    >
      Supprimer
    </button>
  );
};
```

Composant "bête" (*presentational*) : il ne sait pas ce que fait `onDelete`, il se contente de l'appeler au clic. Toute la logique reste dans le composant parent (`TaskItem`), ce qui le rend facilement réutilisable et testable.

### 3.3 `TaskItem.jsx` — orchestration de l'état

```jsx
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

<DeleteTaskButton task={task} onDelete={() => setIsDeleteModalOpen(true)} />

{isDeleteModalOpen && (
  <DeleteConfirmModal
    task={task}
    refreshTasks={refreshTasks}
    onClose={() => setIsDeleteModalOpen(false)}
  />
)}
```

Points à retenir :
- **Un état booléen (`isDeleteModalOpen`) pilote l'affichage conditionnel** de la modal (`condition && <Composant />`), même principe que la modal d'édition déjà présente dans le fichier.
- **`onDelete` reçoit une référence de fonction** (`() => setIsDeleteModalOpen(true)`), jamais son résultat (`setIsDeleteModalOpen(true)` sans flèche). C'est une erreur fréquente : passer `onClick={maFonction()}` exécute `maFonction` immédiatement au rendu au lieu d'attendre le clic — un point classique à vérifier en review sur tout `onClick`/`onDelete`/`onClose`.
- **`refreshTasks` est transmis en cascade** depuis `TasksConsultation` (qui détient la vraie liste des tâches) jusqu'à `DeleteConfirmModal`, pour que la liste se remette à jour après suppression sans recharger la page.

### 3.4 `DeleteConfirmModal.jsx` — confirmation + appel API + gestion d'erreur

```jsx
const DeleteConfirmModal = ({ task, onClose, refreshTasks }) => {
  const [error, setError] = useState(null);

  const handleConfirm = () => {
    deleteTask(task.id)
      .then(() => {
        refreshTasks();
        onClose();
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="task-modal-overlay" onClick={() => onClose()}>
      <div className="task-modal-card" onClick={(event) => event.stopPropagation()}>
        <p>Confirmer suppression tâche {task.task_name}</p>
        <button onClick={() => handleConfirm()}>Confirmer</button>
        <button onClick={onClose}>Annuler</button>
        {error && <p className="error-message">La suppression a échoué, réessayez</p>}
      </div>
    </div>
  );
};
```

Points à retenir :
- **Suppression confirmée avant exécution** (et non "toast avec délai d'annulation"). Choix assumé : une action irréversible est plus sûre à empêcher a priori qu'à annuler a posteriori, et c'est plus simple à implémenter qu'un système de délai/undo.
- **`onClick={(event) => event.stopPropagation()}` sur la carte intérieure** : empêche qu'un clic à l'intérieur de la modal remonte jusqu'à l'overlay (qui fermerait la modal) ou jusqu'à la carte de la tâche (qui ouvrirait la modal de détail).
- **Chaînage de promesse (`.then`/`.catch`)** : `deleteTask` renvoie une promesse (car `del` fait un `fetch`, qui est asynchrone). On ne rafraîchit la liste et on ne ferme la modal qu'*après* confirmation que la suppression a bien été effectuée côté serveur — pas avant. Si la promesse est rejetée (backend injoignable, erreur serveur...), le `.catch` capture l'erreur au lieu de la laisser "non gérée" (*unhandled rejection*) : sans lui, l'utilisateur ne saurait jamais que sa suppression a échoué.
- **`setError(err.message)` et non `setError(err)`** : React ne peut pas afficher un objet `Error` directement dans le JSX, seulement une chaîne de caractères.
- **Le `<p>` d'erreur est affiché hors du `<button>`**, dans la carte : un élément de bloc (`<p>`) imbriqué dans un `<button>` n'est pas valide en HTML, et le message doit rester visible indépendamment de l'état des boutons.
- **La modal ne se ferme pas en cas d'erreur** (pas d'`onClose()` dans le `.catch`) : c'est ce qui permet à l'utilisateur de voir réellement le message avant de réessayer ou d'annuler.
- **Message affiché volontairement générique** (« La suppression a échoué, réessayez ») plutôt que `err.message` brut (ex. `Failed to fetch`) : un message technique de navigateur n'est pas exploitable par un utilisateur final.
- Ce composant **possède l'appel API lui-même** (comme `EditTaskForm` possède `editTask`), plutôt que de recevoir un callback `onConfirm` tout fait du parent. Ça garde `TaskItem` allégé et regroupe la logique de suppression au même endroit que son déclencheur UI.

## 4. Limites actuelles / suite possible

- **Pas de vérification serveur du rôle/authentification** (voir §2.5) — à traiter avant toute mise en production.
- **Pas de test automatisé** pour le endpoint `DELETE /tasks/:id` (contrairement à `updateTaskController` qui a `back/tests/updateTaskController.test.js`).
- **Alternative UX envisagée puis écartée** : un toast avec délai d'annulation ("suppression optimiste" + undo). Plus fluide mais plus complexe (gestion d'un état "en attente", annulation d'un appel API programmé) ; laissé de côté au profit de la modal de confirmation, plus rapide à livrer.

## 5. Grille de review rapide

- [ ] La route utilise bien le verbe `DELETE` sur `/tasks/:id`.
- [ ] L'id est validé avant tout accès à la base.
- [ ] Les codes HTTP sont différenciés selon le cas (`400` id invalide, `404` introuvable, `204` succès, `500` erreur serveur).
- [ ] La requête SQL est paramétrée (`$1`), pas de concaténation de chaîne.
- [ ] Aucun `onClick`/`onDelete`/`onClose` n'est appelé avec `()` au lieu d'être passé par référence.
- [ ] La suppression réelle (front) n'a lieu qu'après confirmation explicite de l'utilisateur.
- [ ] `refreshTasks()` n'est appelé qu'après confirmation que l'appel API a réussi (dans le `.then`, pas avant).
- [ ] Le contrôle d'accès `isAdmin` côté front est bien traité comme un confort d'UX, pas comme une sécurité suffisante.
- [ ] L'appel API a un `.catch` (ou un `try/catch` équivalent) et affiche un message d'erreur visible, pas seulement en console.
- [ ] Aucun `console.log` de débogage oublié dans le code final.

## 6. Note de test : erreur "vue en console mais pas à l'écran"

Pendant le développement, un test (backend coupé volontairement pour simuler une panne) a montré une erreur `Uncaught (in promise)` en console alors que le `.catch` semblait correctement écrit dans le fichier. La cause : le serveur de développement Vite servait encore une **version en cache** du composant, antérieure à l'ajout du `.catch` (visible au décalage entre les numéros de ligne de la stack trace et le fichier réel sur disque). Un simple rechargement de page n'a pas suffi ; il a fallu **redémarrer le serveur de dev du front** pour que le fichier à jour soit repris en compte.

À retenir pour la suite : si un comportement observé dans le navigateur ne correspond pas au code lu, vérifier en premier lieu que la stack trace pointe bien vers les bonnes lignes du fichier actuel avant de chercher un bug ailleurs.
