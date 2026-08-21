import { useState } from "react";
import { editTask } from "../api/tasks";

function TaskCheckBox({ task, refreshTasks }) {
  const [isCheckboxAnimating, setCheckboxAnimating] = useState(false);
  const newStatus = task.status === "TERMINE" ? "A_FAIRE" : "TERMINE";

  function handleClick(e) {
    e.stopPropagation();

    if (newStatus === "TERMINE") {
      setCheckboxAnimating(true);
      setTimeout(() => setCheckboxAnimating(false), 400);
    }

    editTask(task.id, {
      name: task.task_name,
      description: task.description,
      status: newStatus,
      points: task.points,
    }).then(() => refreshTasks());
  }

  return (
    <div
      className={`task-item-checkbox ${isCheckboxAnimating ? "animation-check-box" : ""}`}
      onClick={handleClick}
    ></div>
  );
}

export default TaskCheckBox;
