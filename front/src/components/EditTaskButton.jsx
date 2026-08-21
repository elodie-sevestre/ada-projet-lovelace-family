import "../css/EditTaskButton.css";
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
        M
      </button>
    </>
  );
};

export default EditTaskButton;
