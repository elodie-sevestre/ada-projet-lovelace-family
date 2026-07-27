import TasksList from "./TasksList";
import { useState, useEffect } from "react";
import { getTasks } from "../api/tasks";
import TaskForm from "./TaskForm";
import { createTask } from "../api/tasks";
import { getUsers } from "../api/users";

function TasksConsultation() {
  const [tasks, setTasks] = useState({ toDoTasks: [], finishedTasks: [] });
  const currentUser = { role: "ADMIN" };
  const [members, setMembers] = useState([]);

  const fetchTasks = () => {
    getTasks().then((result) => setTasks(result));
  };

  useEffect(() => {
    getUsers().then((result) => setMembers(result));
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  const onCreate = (taskToCreate) => {
    createTask(taskToCreate).then(() => fetchTasks());
  };

  return (
    <div className="tasks-consultation-contener">
      <TaskForm onCreate={onCreate} members={members} />
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
