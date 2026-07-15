import TasksList from "./TasksList";
import { useState, useEffect } from "react";

function TasksConsultation() {
  const [tasks, setTasks] = useState({ toDoTasks: [], finishedTasks: [] });
  const currentUser = { role: "ADMIN" };

  useEffect(() => {
    fetch("/api/tasks")
      .then((response) => response.json())
      .then((result) => setTasks(result));
  }, []);

  return (
    <div className="tasks-consultation-contener">
      <div className="task-list-contener">
        <p className="tasks-list-title">A faire</p>
        <TasksList tasks={tasks.toDoTasks} currentUser={currentUser} />
      </div>
      <div className="task-list-contener">
        <p className="tasks-list-title">Terminées</p>
        <TasksList tasks={tasks.finishedTasks} currentUser={currentUser} />
      </div>
    </div>
  );
}

export default TasksConsultation;
