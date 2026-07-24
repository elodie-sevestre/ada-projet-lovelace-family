# Front-end

Stack : **React** + **Vite**.

## Structure

```
front/src/
├── App.jsx                  # composant racine
├── main.jsx                 # point d'entrée, monte l'app React
├── api/
│   ├── client.js             # wrapper générique autour de fetch (get/post/put/del)
│   └── tasks.js               # appels API spécifiques aux tâches (getTasks, createTask, editTask, deleteTask)
├── components/
│   ├── TasksList.jsx           # liste des tâches
│   ├── TasksConsultation.jsx   # vue de consultation des tâches
│   ├── TaskItem.jsx             # une tâche dans la liste
│   ├── TaskModalItem.jsx        # détail d'une tâche en modale
│   ├── TaskForm.jsx             # formulaire de création de tâche
│   ├── EditTaskForm.jsx         # formulaire de modification de tâche
│   ├── EditTaskButton.jsx       # bouton déclenchant l'édition
│   ├── DeleteTaskButton.jsx     # déclenche l'ouverture de la modal de confirmation
│   └── DeleteConfirmModal.jsx    # confirmation + appel API + gestion d'erreur
└── css/                       # une feuille de style par composant
```

La suppression suit le même principe que l'édition : `TaskItem` détient un état booléen (`isDeleteModalOpen`) qui pilote l'affichage conditionnel de `DeleteConfirmModal`. La suppression n'est déclenchée qu'après confirmation explicite de l'utilisateur (pas de "toast + annulation", pour rester simple et éviter les suppressions accidentelles).

## Communication avec l'API

Tous les appels HTTP passent par `api/client.js`, qui centralise la gestion des headers JSON et des erreurs (`response.ok`). Les modules comme `api/tasks.js` n'ont qu'à appeler `get`/`post`/`put`/`del` avec la route voulue, sans se soucier des détails de `fetch`.

## Gestion d'état

Pas de state manager global (Redux, Context API...) à ce jour : chaque composant gère son propre état local avec `useState`.

React suit un flux de données unidirectionnel :

- **les données descendent** du parent vers l'enfant via les **props**
- **les actions remontent** de l'enfant vers le parent via des **callbacks** (des fonctions passées en props, que l'enfant se contente d'appeler)

Exemple avec la suppression : `TaskItem` détient l'état `isDeleteModalOpen` et le passe à `DeleteTaskButton` sous forme de callback (`onDelete`). Le bouton ne sait pas ce que fait cette fonction ni où est stocké l'état, il se contente de l'appeler au clic — ce qui le rend réutilisable. `refreshTasks` suit le même principe sur plusieurs niveaux : `TasksConsultation` détient la vraie liste des tâches et transmet cette fonction en descendant jusqu'à `DeleteConfirmModal`, pour que ce composant profond dans l'arbre puisse déclencher un rechargement sans avoir accès à la liste lui-même.

Un state manager global deviendrait utile si une même donnée (ex: l'utilisateur connecté) devait être partagée entre des composants éloignés dans l'arbre, obligeant à faire transiter une prop à travers plusieurs niveaux qui n'en ont pas besoin (_prop drilling_). Ce n'est pas encore le cas ici.
