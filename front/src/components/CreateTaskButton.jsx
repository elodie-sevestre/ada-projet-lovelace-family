import "../css/CreateTaskButton.css";
import addTaskIcon from "../assets/icon-add-task.png";

// onOpen : fonction transmise par le parent pour ouvrir la modal de création
const CreateTaskButton = ({ onOpen }) => {
  return (
    <button
      type="button"
      className="create-task-button"
      aria-label="Créer une nouvelle tâche"
      onClick={onOpen}
    >
      <img src={addTaskIcon} alt="" className="create-task-button-icon" />
      Ajouter une nouvelle tâche
    </button>
  );
};

export default CreateTaskButton;
