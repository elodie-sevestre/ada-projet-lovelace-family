import TaskForm from "../forms/TaskForm.jsx";

function CreateTaskModal({ members, onCreate, onClose }) {
  return (
    <div
      className="task-modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <TaskForm members={members} onCreate={onCreate} onClose={onClose} />
    </div>
  );
}

export default CreateTaskModal;
