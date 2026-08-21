import TaskItem from "./TaskItem.jsx";
import "../css/TasksList.css";

function TasksList({ tasks, currentUser, refreshTasks }) {
  const isAdmin = currentUser.role === "ADMIN";

  return (
    <div className="tasks-list-contener">
      {/* En-tête de colonnes, affiché une seule fois pour toute la liste */}
      <div className="tasks-list-header-row">
        <span className="tasks-list-header-title">Titre</span>
        <div className="tasks-list-header-right">
          <span className="tasks-list-header-assignation">Assignée à</span>
          <span className="tasks-list-header-points">Points</span>
          {isAdmin && <span className="tasks-list-header-edit">Modifier</span>}
          {isAdmin && (
            <span className="tasks-list-header-delete">Supprimer</span>
          )}
        </div>
      </div>

      <div className="tasks-list-items-contener">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            currentUser={currentUser}
            refreshTasks={refreshTasks}
          />
        ))}
      </div>
    </div>
  );
}

export default TasksList;
