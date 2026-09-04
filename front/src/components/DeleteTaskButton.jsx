import "../css/DeleteTaskButton.css";
import deleteIcon from "../assets/icon-delete-task.png";
const DeleteTaskButton = ({ task, onDelete }) => {
  return (
    <>
      <button
        type="button"
        aria-label={`Suppression de la tâche ${task.task_name}`}
        className="delete-button"
        onClick={() => onDelete(task)}
      >
        <img
          src={deleteIcon}
          alt="icone supprimer"
          className="delete-button-icon"
        />
      </button>
    </>
  );
};

export default DeleteTaskButton;
