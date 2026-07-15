import { useState } from "react";
import "../css/TaskItem.css";
import TaskModalItem from "./TaskModalItem.jsx";

function TaskItem({ task, currentUser }) {
  const isAdmin = currentUser.role === "ADMIN";
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="task-item-card" onClick={() => setIsModalOpen(true)}>
        <div className="task-item-left-card">
          <div className="task-item-name">{task.task_name}</div>
          {isAdmin && (
            <div
              className="task-item-update-button"
              onClick={(e) => e.stopPropagation()} //Evite que ça ouvre la modal en cliquant sur les boutons modifier ou supprimer
            ></div>
          )}
          {isAdmin && (
            <div
              className="task-item-delete-button"
              onClick={(e) => e.stopPropagation()}
            ></div>
          )}
        </div>
        <div className="task-item-right-card">
          <div className="task-item-assignation">{task.assigned_to}</div>
          <div className="task-item-points">{task.points}</div>
          <div className="task-item-checkbox"></div>
        </div>
      </div>
      {isModalOpen && (
        <TaskModalItem task={task} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

export default TaskItem;
