import { useState } from "react";
import "../css/TaskItem.css";
import TaskModalItem from "./TaskModalItem.jsx";
// import modal confirmation suppression tâche
import DeleteConfirmModal from "./DeleteConfirmModal.jsx";
//import bouton d'édition pour modifier la tâche
import EditTaskButton from "./EditTaskButton.jsx";
//import bouton suppression de la tâche
import DeleteTaskButton from "./DeleteTaskButton.jsx";
//import checkbox
import TaskCheckbox from "./TaskCheckBox.jsx";

function TaskItem({ task, currentUser, refreshTasks }) {
  const isAdmin = currentUser.role === "ADMIN";
  const [isModalOpen, setIsModalOpen] = useState(false);
  // useState pour afficher le pop-up en mode édition
  const [isModalEditing, setIsModalEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isCompleted = task.status === "TERMINE";
  const cardClassName = `task-item-card${isCompleted ? " completed" : ""}`;

  // Les libellés de colonnes ("Titre", "Assignée à", "Points"...) ne sont
  // plus répétés ici : ils vivent une seule fois dans l'en-tête de
  // TasksList, comme sur la maquette.
  return (
    <>
      <div className={cardClassName} onClick={() => setIsModalOpen(true)}>
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
            >
              <DeleteTaskButton
                task={task}
                onDelete={() => setIsDeleteModalOpen(true)}
              />
              {/* affichage du modal que si on clique sur le bouton supprimer */}
              {isDeleteModalOpen && (
                <DeleteConfirmModal
                  task={task}
                  refreshTasks={refreshTasks}
                  onClose={() => setIsDeleteModalOpen(false)}
                />
              )}
            </div>
          )}
          <TaskCheckbox task={task} refreshTasks={refreshTasks} />
        </div>
      </div>
      {isModalOpen && (
        <TaskModalItem
          task={task}
          isEditing={isModalEditing}
          refreshTasks={refreshTasks}
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
