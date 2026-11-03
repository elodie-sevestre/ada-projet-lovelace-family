import "../../css/DeleteTaskButton.css";

const DeleteTaskButton = ({ task, onDelete }) => {
  return (
    <>
      <button
        type="button"
        aria-label={`Suppression de la tâche ${task.task_name}`}
        className="delete-button"
        onClick={() => onDelete(task)}
      >
        <svg
          viewBox="0 0 24 24"
          className="delete-button-icon"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M22 3v2H2V3h6V2h1V1h6v1h1v1zM4 7v15h1v1h14v-2h1V7zm12 12h-2V9h2zm-6 0H8V9h2z"
          />
        </svg>
      </button>
    </>
  );
};

export default DeleteTaskButton;
