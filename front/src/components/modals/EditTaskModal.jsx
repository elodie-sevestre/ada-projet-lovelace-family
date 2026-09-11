import EditTaskForm from "../forms/EditTaskForm.jsx";

function EditTaskModal({ task, onClose, refreshTasks, members }) {
  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="app-modal" onClick={(e) => e.stopPropagation()}>
        <EditTaskForm
          task={task}
          onClose={onClose}
          refreshTasks={refreshTasks}
          members={members}
        />
      </div>
    </div>
  );
}

export default EditTaskModal;
