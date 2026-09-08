import editIcon from "../../assets/icon-add-task.png";
import "../../css/EditTaskButton.css";

const EditTaskButton = ({ task, onEdit }) => {
  return (
    <button
      type="button"
      aria-label={`Modifier la tâche ${task.task_name}`}
      className="update-button"
      onClick={() => {
        onEdit(task);
      }}
    >
      <img
        src={editIcon}
        alt="icone modification"
        className="update-button-icon"
      />
    </button>
  );
};

export default EditTaskButton;
