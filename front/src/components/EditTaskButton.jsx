const EditTaskButton = ({ task, onEdit }) => {
  return (
    <>
      <button
        type="button"
        aria-label={`Modifier la tâche ${task.task_name}`}
        className="update-button"
        onClick={() => {
          onEdit(task);
        }}
      >
        Modifier
      </button>
    </>
  );
};

export default EditTaskButton;
