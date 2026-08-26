# Front-end

Stack : **React + Vite**. Pas de state manager global (Redux/Zustand) : état géré localement par composant via `useState`/`useEffect`.

## Structure

```
front/src/
├── main.jsx            # point d'entrée, monte <App />
├── App.jsx              # monte TasksConsultation
├── api/                 # couche d'appel au backend
│   ├── client.js         # wrapper fetch (get/post/put/del)
│   ├── tasks.js           # appels liés aux tâches
│   └── users.js           # appels liés aux utilisateurs
├── components/           # composants React
└── css/                  # une feuille de style par composant
```

## Couche API (`api/`)

`client.js` encapsule `fetch` autour d'une `BASE_URL` fixe (`http://localhost:5000/api`) et lève une erreur si la réponse n'est pas OK. `tasks.js`/`users.js` exposent des fonctions métier (`getTasks`, `createTask`, `editTask`, `deleteTask`, `getUsers`) qui appellent ce client et renvoient des Promises.

> Pas d'en-tête `Authorization` envoyé automatiquement pour l'instant — à ajouter pour que les appels passent le middleware `requireAuth` du back en conditions réelles.

## Composants principaux

- **`TasksConsultation`** — composant racine de la page : récupère les tâches (`getTasks`) et les membres (`getUsers`) au montage, sépare l'affichage en deux listes (« À faire » / « Terminées »), gère l'ouverture de la modale de création
- **`TasksList`** — affiche une liste de `TaskItem` à partir d'un tableau de tâches
- **`TaskItem`** — une tâche individuelle (actions d'édition/suppression/validation portées par les boutons dédiés)
- **`CreateTaskButton` / `CreateTaskModal` / `TaskForm`** — flux de création d'une tâche en modale
- **`EditTaskButton` / `EditTaskForm`** — flux d'édition d'une tâche
- **`DeleteTaskButton` / `DeleteConfirmModal`** — flux de suppression avec confirmation
- **`TaskModalItem`** — rendu d'une tâche dans le contexte d'une modale

## Flux de données

Le composant racine (`TasksConsultation`) détient l'état des tâches et des membres, et transmet aux enfants les callbacks nécessaires (`onCreate`, `refreshTasks`) en props — pas de contexte React utilisé. Après chaque mutation (création/édition/suppression), le composant enfant appelle le callback reçu, qui redéclenche un `fetchTasks()` côté racine pour resynchroniser l'affichage avec le backend.

## Rôle utilisateur

`currentUser` est actuellement codé en dur dans `TasksConsultation` (`{ role: "ADMIN" }`) plutôt que dérivé d'une session authentifiée réelle — à relier à l'authentification une fois le flux de connexion branché côté front.

## Tests

Aucun test automatisé côté frontend pour l'instant (voir [Back-end](../back/index.md#tests)).
