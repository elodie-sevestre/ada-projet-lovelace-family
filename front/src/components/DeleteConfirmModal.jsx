import { useState } from "react";
import "../css/DeleteConfirmModal.css";
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
      <div className="task-modal-overlay" onClick={onClose}>
        {/* div card à l'intérieur pour ne pas fermer si on clique dedans */}
        <div className="app-modal" onClick={(event) => event.stopPropagation()}>
          <div className="app-modal-tab">Supprimer la tâche</div>

          <div className="app-modal-card">
            <button
              type="button"
              className="app-modal-close"
              aria-label="Fermer"
              onClick={onClose}
            >
              ✕
            </button>

            <p>Confirmer la suppression de la tâche « {task.task_name} » ?</p>

            {error && (
              <p className="error-message">
                La suppression a échoué, réessayez
              </p>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                aria-label="Annuler suppression"
                onClick={onClose}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                aria-label="Confirmer suppression"
                onClick={handleConfirm}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmModal;
