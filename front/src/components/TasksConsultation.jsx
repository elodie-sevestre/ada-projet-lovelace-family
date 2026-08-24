import TasksList from "./TasksList";
import { useState, useEffect } from "react";
import { getTasks } from "../api/tasks";
import CreateTaskButton from "./CreateTaskButton";
import CreateTaskModal from "./CreateTaskModal";
import { createTask } from "../api/tasks";
import { getUsers } from "../api/users";
import "../css/TasksConsultation.css";

function TasksConsultation() {
  const [tasks, setTasks] = useState({ toDoTasks: [], finishedTasks: [] });
  const currentUser = { role: "ADMIN" };
  const [members, setMembers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const fetchTasks = () => {
    getTasks().then((result) => setTasks(result));
  };

  useEffect(() => {
    getUsers().then((result) => setMembers(result));
    fetchTasks();
  }, []);

  const onCreate = (taskToCreate) => {
    return createTask(taskToCreate).then(() => fetchTasks());
  };

  return (
    <div className="tasks-consultation-contener">
      <div className="task-list-contener">
        <p className="tasks-list-title">Tâches à faire</p>

        <TasksList
          tasks={tasks.toDoTasks}
          currentUser={currentUser}
          refreshTasks={fetchTasks}
        />
      </div>
      <div className="task-list-contener">
        <p className="tasks-list-title">Tâches terminées</p>
        <TasksList
          tasks={tasks.finishedTasks}
          currentUser={currentUser}
          refreshTasks={fetchTasks}
        />
        <CreateTaskButton onOpen={() => setIsCreating(true)} />
        {isCreating && (
          <CreateTaskModal
            members={members}
            onCreate={onCreate}
            onClose={() => setIsCreating(false)}
          />
        )}
      </div>
    </div>
  );
}

export default TasksConsultation;
