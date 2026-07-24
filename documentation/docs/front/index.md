# Front-end

Stack : **React** + **Vite**.

## Structure

```
front/src/
├── App.jsx                  # composant racine
├── main.jsx                 # point d'entrée, monte l'app React
├── api/
│   ├── client.js             # wrapper générique autour de fetch (get/post/put/del)
│   └── tasks.js               # appels API spécifiques aux tâches (getTasks, createTask, editTask)
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

Tous les appels HTTP passent par `api/client.js`, qui centralise la gestion des headers JSON et des erreurs (`response.ok`). Les modules comme `api/tasks.js` n'ont qu'à appeler `get`/`post`/`put` avec la route voulue, sans se soucier des détails de `fetch`.
