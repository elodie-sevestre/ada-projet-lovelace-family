import "../css/TaskModalItem.css";
// import du formulaire d'édition de la tâche à modifier
import EditTaskForm from "./EditTaskForm.jsx";

//mapping des statuts, en dehors du composant pour formater les données de statut:
const STATUT_LABELS = {
  A_FAIRE: "À faire",
  TERMINE: "Terminée",
};

function TaskModalItem({ task, onClose, isEditing, refreshTasks }) {
  return (
    <div
      className="task-modal-overlay"
      onClick={() => {
        !isEditing && onClose();
      }}
    >
      <div className="task-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* ajout condition !isEditing pour masquer la X qd le pop-up est en mode édition */}
        {!isEditing && (
          <button className="task-modal-close-button" onClick={onClose}>
            x
          </button>
        )}
        {/* condition d'affichage du pop-up en mode lecture ou édition de la tâche */}
        {isEditing ? (
          <EditTaskForm
            task={task}
            refreshTasks={refreshTasks}
            onClose={onClose}
          />
        ) : (
          <>
            <div className="task-modal-informations-top">
              <div className="task-modal-statut-label">
                <p
                  className="task-detail-modal-status"
                  data-status={task.status}
                >
                  Statut : {STATUT_LABELS[task.status]}
                </p>
              </div>
              <div
                className="task-detail-modal-round-assignation"
                title={`Assigné à ${task.assigned_to}`}
              >
                <p className="task-detail-modal-assignation">
                  {task.assigned_to?.charAt(0).toUpperCase()}
                </p>
              </div>
            </div>
            <div className="task-modal-informations-middle">
              <div className="task-modal-title-and-points">
                {" "}
                <p className="task-detail-modal-name">{task.task_name}</p>
                <p className="task-detail-modal-points">{task.points} Points</p>
              </div>
              <div className="task-modal-description-case">
                <p className="task-detail-modal-description">
                  {task.description}
                </p>
              </div>
            </div>
            <div className="task-modal-informations-bottom">
              <p className="task-detail-modal-date-creation">
                Crée le :{" "}
                {new Date(task.created_at).toLocaleDateString("fr-FR")}
              </p>
              <p className="task-detail-modal-date-update">
                Modifiée le :{" "}
                {new Date(task.updated_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskModalItem;
