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
│   └── EditTaskButton.jsx       # bouton déclenchant l'édition
└── css/                       # une feuille de style par composant
```

## Communication avec l'API

Tous les appels HTTP passent par `api/client.js`, qui centralise la gestion des headers JSON et des erreurs (`response.ok`). Les modules comme `api/tasks.js` n'ont qu'à appeler `get`/`post`/`put` avec la route voulue, sans se soucier des détails de `fetch`.
