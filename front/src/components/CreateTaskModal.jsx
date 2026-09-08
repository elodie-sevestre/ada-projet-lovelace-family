import TaskForm from "./TaskForm";

function CreateTaskModal({ members, onCreate, onClose }) {
  return (
    <div
      className="task-modal-overlay"
      onClick={() => {
        onClose();
      }}
    >
      <div className="app-modal" onClick={(event) => event.stopPropagation()}>
        <TaskForm members={members} onCreate={onCreate} onClose={onClose} />
      </div>
    </div>
  );
}

export default CreateTaskModal;
