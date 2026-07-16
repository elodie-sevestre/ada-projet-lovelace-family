import TasksList from "./TasksList";
import { useState, useEffect } from "react";

function TasksConsultation() {
  const [tasks, setTasks] = useState({ toDoTasks: [], finishedTasks: [] });
  const currentUser = { role: "ADMIN" };

  const fetchTasks = () => {
    fetch("http://localhost:5000/api/tasks")
      .then((response) => response.json())
      .then((result) => setTasks(result));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="tasks-consultation-contener">
      <div className="task-list-contener">
        <p className="tasks-list-title">A faire</p>
        <TasksList
          tasks={tasks.toDoTasks}
          currentUser={currentUser}
          refreshTasks={fetchTasks}
        />
      </div>
      <div className="task-list-contener">
        <p className="tasks-list-title">Terminées</p>
        <TasksList
          tasks={tasks.finishedTasks}
          currentUser={currentUser}
          refreshTasks={fetchTasks}
        />
      </div>
    </div>
  );
}

export default TasksConsultation;
