import { useState, useEffect } from "react";
import { createTask, getTasks } from "../api/tasks";
import { getUsers } from "../api/users";
import "../css/TasksConsultation.css";
import TasksList from "./TasksList";
import CreateTaskButton from "./CreateTaskButton";
import CreateTaskModal from "./CreateTaskModal";
import MemberSidebar from "./MemberSideBar";
import TaskCelebration from "./TaskCelebration";
import leafIcon from "../assets/leaf_icon.png";
import flowerIcon from "../assets/flower_icon.png";
import AppHeader from "./AppHeader";

function TasksConsultation({ onLogout }) {
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

  // TODO: remplacer par le vrai membre connecté une fois l'authentification
  // en place. En attendant, on affiche le premier membre de la liste.
  const currentMember = members[0];
  const memberName = currentMember?.name ?? "";
  const memberInitial = memberName ? memberName.charAt(0).toUpperCase() : "";
  const [showCelebration, setShowCelebration] = useState(false);
  const handleCelebrate = () => setShowCelebration(true);

  return (
    <div className="tasks-consultation-contener">
      <AppHeader
        memberTribe="La Tribu de Bernard"
        memberInitial={memberInitial}
        memberName={memberName}
        onLogout={onLogout}
      />
      {/* Sidebar avatar : nom et points réels via l'API,
          progression toujours en dur (pas de source de données pour ça) */}
      <aside className="member-side-bar">
        <MemberSidebar
          memberInitial={memberInitial}
          memberName={memberName}
          totalPoints={currentMember?.total_points ?? 0}
          progressPercent={35}
        />
      </aside>
      <main className="task-content">
        <section className="task-list-contener">
          <h2 className="tasks-list-title">
            <img src={leafIcon} alt="Icone de feuille d'une plante" />
            Tâches à faire
          </h2>
          <TasksList
            tasks={tasks.toDoTasks}
            currentUser={currentUser}
            refreshTasks={fetchTasks}
            onCelebrate={handleCelebrate}
          />
        </section>
        <section className="task-list-contener completed">
          <h2 className="tasks-list-title completed">
            <img src={flowerIcon} alt="Icone de feuille d'une plante" /> Tâches
            terminées
          </h2>
          <TasksList
            tasks={tasks.finishedTasks}
            currentUser={currentUser}
            refreshTasks={fetchTasks}
            onCelebrate={handleCelebrate}
          />
          <CreateTaskButton onOpen={() => setIsCreating(true)} />
          {isCreating && (
            <CreateTaskModal
              members={members}
              onCreate={onCreate}
              onClose={() => setIsCreating(false)}
            />
          )}
        </section>
        <TaskCelebration
          show={showCelebration}
          onDone={() => setShowCelebration(false)}
        />
      </main>
    </div>
  );
}

export default TasksConsultation;
