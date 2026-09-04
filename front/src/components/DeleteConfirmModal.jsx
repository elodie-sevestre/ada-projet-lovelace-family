import { useState } from "react";
import { deleteTask } from "../api/tasks";

const DeleteConfirmModal = ({ task, onClose, refreshTasks }) => {
  // initialisation useState pour récupérer le message d'erreur du back à null (c'est vide intentionnellement)
  const [error, setError] = useState(null);

  const handleConfirm = () => {
    deleteTask(task.id)
      .then(() => {
        refreshTasks();
        onClose();
      })
      .catch((err) => {
        console.log("catch atteint", err);
        setError(err.message);
      });
  };
  return (
    <>
      {/* div overlay extérieur pour fermer si on clique en dehors */}
      <div
        className="task-modal-overlay"
        onClick={() => {
          onClose();
        }}
      >
        {/* div card à l'intérieur pr ne pas fermer si on clique dedans */}
        <div
          className="task-modal-card"
          onClick={(event) => event.stopPropagation()}
        >
          <p>Confirmer suppression tâche {task.task_name}</p>
          <button
            type="button"
            aria-label="Confirmer suppression"
            onClick={() => handleConfirm()}
          >
            Confirmer
          </button>
          <button
            type="button"
            aria-label="Annuler suppression"
            onClick={onClose}
          >
            Annuler
          </button>
          {error && (
            <p className="error-message">
              {"La suppression a échoué, réessayez"}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmModal;
