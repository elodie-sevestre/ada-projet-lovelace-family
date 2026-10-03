import { useState } from "react";
import { updateTaskStatus } from "../../api/tasks"; // NOUVEAU : remplace editTask (PUT réservé à l'admin)
import { TASK_STATUS } from "../../constants.js";
import "../../css/TaskCheckBox.css";

function TaskCheckBox({ task, refreshTasks, onCelebrate }) {
  const [isCheckboxAnimating, setCheckboxAnimating] = useState(false);
  const newStatus =
    task.status === TASK_STATUS.DONE ? TASK_STATUS.TODO : TASK_STATUS.DONE;

  let classAnimation = "";
  if (isCheckboxAnimating) {
    if (newStatus === TASK_STATUS.DONE) {
      classAnimation = "animation-check-checkbox";
    } else {
      classAnimation = "animation-uncheck-checkbox";
    }
  }

  let classStatut;
  if (task.status === TASK_STATUS.DONE) {
    classStatut = "checkbox-validee";
  } else {
    classStatut = "checkbox-non-validee";
  }

  function handleClick(e) {
    e.stopPropagation();

    setCheckboxAnimating(true);
    setTimeout(() => setCheckboxAnimating(false), 400);

    // NOUVEAU : on n'envoie plus que l'id et le nouveau statut (PATCH /api/tasks/:id/status).
    // Le membre assigné (ou l'admin) a le droit d'appeler cette route ; le back applique la règle.
    updateTaskStatus(task.id, newStatus)
      .then(() => {
        // Déclenche la célébration uniquement quand on valide la tâche,
        // et seulement APRÈS la réponse du serveur (pas si la requête a échoué)
        if (newStatus === TASK_STATUS.DONE) {
          onCelebrate?.();
        }
        setTimeout(() => refreshTasks(), 400);
      })
      .catch((err) => {
        // NOUVEAU : l'échec n'est plus silencieux ; on resynchronise l'affichage avec le serveur
        console.error(err);
        refreshTasks();
      });
  }

  return (
    <div
      className={`task-checkbox ${classStatut} ${classAnimation}`}
      onClick={handleClick}
    ></div>
  );
}

export default TaskCheckBox;
