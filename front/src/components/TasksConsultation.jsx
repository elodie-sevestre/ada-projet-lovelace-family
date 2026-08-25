import TasksList from "./TasksList";
import { useState, useEffect } from "react";
import { getTasks } from "../api/tasks";
import CreateTaskButton from "./CreateTaskButton";
import CreateTaskModal from "./CreateTaskModal";
import { createTask } from "../api/tasks";
import { getUsers } from "../api/users";
import TaskCelebration from "./TaskCelebration.jsx";
import "../css/TasksConsultation.css";

function TasksConsultation() {
  const [tasks, setTasks] = useState({ toDoTasks: [], finishedTasks: [] });
  const currentUser = { role: "ADMIN" };
  const [members, setMembers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  // La célébration vit ici, au sommet de l'arbre : quand une tâche est
  // validée, elle change de liste (toDoTasks -> finishedTasks) après
  // refreshTasks, ce qui démonte le TaskCheckBox d'origine. En gardant
  const [showCelebration, setShowCelebration] = useState(false);

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
          onCelebrate={() => setShowCelebration(true)}
        />
      </div>
      <div className="task-list-contener">
        <p className="tasks-list-title">Tâches terminées</p>
        <TasksList
          tasks={tasks.finishedTasks}
          currentUser={currentUser}
          refreshTasks={fetchTasks}
          onCelebrate={() => setShowCelebration(true)}
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

      <TaskCelebration
        show={showCelebration}
        onDone={() => setShowCelebration(false)}
      />
    </div>
  );
}

export default TasksConsultation;
