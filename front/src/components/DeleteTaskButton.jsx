import "../css/DeleteTaskButton.css";
const DeleteTaskButton = ({ task, onDelete }) => {
  return (
    <>
      <button
        type="button"
        aria-label={`Suppression de la tâche ${task.task_name}`}
        className="delete-button"
        onClick={() => onDelete(task)}
      >
        Supprimer
      </button>
    </>
  );
};

export default DeleteTaskButton;
