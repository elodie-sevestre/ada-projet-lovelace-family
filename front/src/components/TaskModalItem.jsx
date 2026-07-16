import "../css/TaskModalItem.css";
// import du formulaire d'édition de la tâche à modifier
import EditTaskForm from "./EditTaskForm.jsx";

function TaskModalItem({ task, onClose, isEditing }) {
  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* ajout condition !isEditing pour masquer la X qd le pop-up est en mode édition */}
        {!isEditing && (
          <button className="task-modal-close-button" onClick={onClose}>
            x
          </button>
        )}
        {/* condition d'affichage du pop-up en mode lecture ou édition de la tâche */}
        {isEditing ? (
          <EditTaskForm task={task} onClose={onClose} />
        ) : (
          <>
            <div className="task-modal-informations">
              <p className="task-detail-modal-name">{task.task_name}</p>
              <p className="task-detail-modal-description">
                {task.description}
              </p>
              <p className="task-detail-modal-date-creation">
                {task.created_at}
              </p>
              <p className="task-detail-modal-date-update">{task.updated_at}</p>
            </div>
            <div className="task-modal-informations-2">
              <p className="task-detail-modal-status">{task.status}</p>
              <p className="task-detail-modal-assignation">
                {task.assigned_to}
              </p>
              <p className="task-detail-modal-points">{task.points}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskModalItem;
