import TasksList from "./TasksList";
import { useState, useEffect } from "react";
import { getTasks } from "../api/tasks";

function TasksConsultation() {
  const [tasks, setTasks] = useState({ toDoTasks: [], finishedTasks: [] });
  const currentUser = { role: "ADMIN" };

  const fetchTasks = () => {
    getTasks().then((result) => setTasks(result));
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
