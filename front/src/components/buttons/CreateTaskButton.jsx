import "../../css/CreateTaskButton.css";

// onOpen : fonction transmise par le parent pour ouvrir la modal de création
const CreateTaskButton = ({ onOpen }) => {
  return (
    <button
      type="button"
      className="create-task-button"
      aria-label="Créer une nouvelle tâche"
      onClick={onOpen}
    >
      Ajouter une tâche
    </button>
  );
};

export default CreateTaskButton;
