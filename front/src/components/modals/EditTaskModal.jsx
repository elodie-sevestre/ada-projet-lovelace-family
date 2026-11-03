import EditTaskForm from "../forms/EditTaskForm.jsx";

function EditTaskModal({ task, onClose, refreshTasks, members }) {
  return (
    <div
      className="task-modal-overlay"
      // Ferme seulement si on clique sur le fond lui-même, pas dans la fenêtre
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <EditTaskForm
        task={task}
        onClose={onClose}
        refreshTasks={refreshTasks}
        members={members}
      />
    </div>
  );
}

export default EditTaskModal;
