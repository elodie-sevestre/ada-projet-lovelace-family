import { useState } from "react";
import { editTask } from "../../api/tasks";
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

    // Déclenche la célébration uniquement quand on valide la tâche
    if (newStatus === TASK_STATUS.DONE) {
      onCelebrate?.();
    }

    editTask(task.id, {
      name: task.task_name,
      description: task.description,
      status: newStatus,
      points: task.points,
    }).then(() => setTimeout(() => refreshTasks(), 400));
  }

  return (
    <div
      className={`task-checkbox ${classStatut} ${classAnimation}`}
      onClick={handleClick}
    ></div>
  );
}

export default TaskCheckBox;
