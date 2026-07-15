import { useState } from "react";
import "../css/TaskItem.css";
import TaskModalItem from "./TaskModalItem.jsx";
//import bouton d'édition pour modifier la tâche
import EditTaskButton from "./EditTaskButton.jsx";

function TaskItem({ task, currentUser }) {
  const isAdmin = currentUser.role === "ADMIN";
  const [isModalOpen, setIsModalOpen] = useState(false);
  // useState pour afficher le pop-up en mode édition
  const [isModalEditing, setIsModalEditing] = useState(false);

  return (
    <>
      <div className="task-item-card" onClick={() => setIsModalOpen(true)}>
        <div className="task-item-left-card">
          <div className="task-item-name">{task.task_name}</div>
        </div>
        <div className="task-item-right-card">
          <div className="task-item-assignation">{task.assigned_to}</div>
          <div className="task-item-points">{task.points}</div>
          {isAdmin && (
            <div
              className="task-item-update-button"
              onClick={(e) => e.stopPropagation()} //Evite que ça ouvre la modal en cliquant sur les boutons modifier ou supprimer
            >
              <EditTaskButton
                task={task}
                onEdit={() => {
                  setIsModalOpen(true);
                  setIsModalEditing(true);
                }}
              />
            </div>
          )}
          {isAdmin && (
            <div
              className="task-item-delete-button"
              onClick={(e) => e.stopPropagation()}
            ></div>
          )}
          <div className="task-item-checkbox"></div>
        </div>
      </div>
      {isModalOpen && (
        <TaskModalItem
          task={task}
          isEditing={isModalEditing}
          onClose={() => {
            setIsModalOpen(false);
            setIsModalEditing(false);
          }}
        />
      )}
    </>
  );
}

export default TaskItem;
