import { useState } from "react";
import { editTask } from "../api/tasks";
import "../css/TaskCheckBox.css";

function TaskCheckBox({ task, refreshTasks, onCelebrate }) {
  const [isCheckboxAnimating, setCheckboxAnimating] = useState(false);
  const newStatus = task.status === "TERMINE" ? "A_FAIRE" : "TERMINE";

  let classAnimation = "";
  if (isCheckboxAnimating) {
    if (newStatus === "TERMINE") {
      classAnimation = "animation-check-checkbox";
    } else {
      classAnimation = "animation-uncheck-checkbox";
    }
  }

  let classStatut;
  if (task.status === "TERMINE") {
    classStatut = "checkbox-validee";
  } else {
    classStatut = "checkbox-non-validee";
  }

  function handleClick(e) {
    e.stopPropagation();

    setCheckboxAnimating(true);
    setTimeout(() => setCheckboxAnimating(false), 400);

    // Déclenche la célébration uniquement quand on valide la tâche
    if (newStatus === "TERMINE") {
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
