import { TASK_STATUS } from "../../constants.js";
import "../../css/TaskItemModal.css";

//mapping des statuts, en dehors du composant pour formater les données de statut:
const STATUT_LABELS = {
  [TASK_STATUS.TODO]: "À faire",
  [TASK_STATUS.DONE]: "Terminée",
};

function TaskItemModal({ task, onClose }) {
  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="app-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="app-modal-tab">{task.task_name}</h2>

        <div className="app-modal-card">
          <button
            type="button"
            className="app-modal-close"
            aria-label="Fermer"
            onClick={onClose}
          >
            ✕
          </button>

          <h3 className="task-detail-label">Description</h3>
          <p className="task-detail-description">
            {task.description || "Aucune description"}
          </p>

          <dl className="task-detail-infos">
            <div className="task-detail-info">
              <dt>Assignée à</dt>
              <dd>{task.assigned_to}</dd>
            </div>
            <div className="task-detail-info">
              <dt>Points</dt>
              <dd>{task.points}</dd>
            </div>
            <div className="task-detail-info">
              <dt>Statut</dt>
              <dd>{STATUT_LABELS[task.status]}</dd>
            </div>
          </dl>

          <div className="task-detail-dates">
            <p>
              Créée le : {new Date(task.created_at).toLocaleDateString("fr-FR")}
            </p>
            <p>
              Modifiée le :{" "}
              {new Date(task.updated_at).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TaskItemModal;
