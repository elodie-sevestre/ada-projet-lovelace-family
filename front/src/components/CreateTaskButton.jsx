import "../css/CreateTaskButton.css";

// onOpen : fonction transmise par le parent pour ouvrir la modal de création
const CreateTaskButton = ({ onOpen }) => {
  return (
    <button
      type="button"
      className="create-task-button"
      aria-label="Créer une nouvelle tâche"
      onClick={onOpen}
    >
      <span className="create-task-button-icon" aria-hidden="true">
        +
      </span>
      Ajouter une nouvelle tâche
    </button>
  );
};

export default CreateTaskButton;
