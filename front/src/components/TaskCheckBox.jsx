import { useState } from "react";
import { editTask } from "../api/tasks";
import "../css/TaskCheckBox.css";

function TaskCheckBox({ task, refreshTasks }) {
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
    classStatut = "checkbox-terminee";
  } else {
    classStatut = "checkbox-non-terminee";
  }

  function handleClick(e) {
    e.stopPropagation();

    setCheckboxAnimating(true);
    setTimeout(() => setCheckboxAnimating(false), 400);

    editTask(task.id, {
      name: task.task_name,
      description: task.description,
      status: newStatus,
      points: task.points,
    }).then(() => refreshTasks());
  }

  return (
    <div
      className={`task-item-checkbox ${classStatut} ${classAnimation}`}
      onClick={handleClick}
    ></div>
  );
}

export default TaskCheckBox;
