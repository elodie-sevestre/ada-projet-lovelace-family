const CreateTaskButton = ({ onOpen }) => {
  return (
    <button
      type="button"
      aria-label="Créer une nouvelle tâche"
      className="btn btn-primary"
      onClick={onOpen}
    >
      Ajouter une nouvelle tâche
    </button>
  );
};

export default CreateTaskButton;
