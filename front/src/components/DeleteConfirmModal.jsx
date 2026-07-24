import { deleteTask } from "../api/tasks";

const DeleteConfirmModal = ({ task, onClose, refreshTasks }) => {
  const handleConfirm = () => {
    deleteTask(task.id).then(() => {
      refreshTasks();
      onClose();
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
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmModal;
