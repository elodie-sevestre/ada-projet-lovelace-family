import { useState } from "react";
import TaskItemModal from "../modals/TaskItemModal.jsx";
import EditTaskModal from "../modals/EditTaskModal.jsx";
import DeleteConfirmModal from "../modals/DeleteConfirmModal.jsx";
import EditTaskButton from "../buttons/EditTaskButton.jsx";
import DeleteTaskButton from "../buttons/DeleteTaskButton.jsx";
import TaskCheckbox from "./TaskCheckBox.jsx";
import { TASK_STATUS } from "../../constants.js";
import "../../css/TaskItem.css";
import "../../css/TaskCheckBox.css";

function TaskItem({ task, currentUser, refreshTasks, onCelebrate, members }) {
  const isAdmin = currentUser.role === "ADMIN";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isCompleted = task.status === TASK_STATUS.DONE;
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
                  setIsEditModalOpen(true);
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
          <div className="task-item-check-box">
            <TaskCheckbox
              task={task}
              refreshTasks={refreshTasks}
              onCelebrate={onCelebrate}
            />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <TaskItemModal
          task={task}
          refreshTasks={refreshTasks}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
      {isEditModalOpen && (
        <EditTaskModal
          task={task}
          refreshTasks={refreshTasks}
          onClose={() => setIsEditModalOpen(false)}
          members={members}
        />
      )}
    </>
  );
}

export default TaskItem;
