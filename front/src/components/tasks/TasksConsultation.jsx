import { useState, useEffect } from "react";
import { createTask, getTasks } from "../../api/tasks.js";
import { getUsers, getCurrentUserInfo } from "../../api/users.js";
import AppHeader from "../layout/AppHeader.jsx";
import MemberSidebar from "../layout/MemberSideBar.jsx";
import CreateTaskButton from "../buttons/CreateTaskButton.jsx";
import CreateTaskModal from "../modals/CreateTaskModal.jsx";
import TasksList from "./TasksList.jsx";
import TaskCelebration from "./TaskCelebration.jsx";
import leafIcon from "../../assets/leaf_icon.png";
import flowerIcon from "../../assets/flower_icon.png";
import greenSproutAvatar from "../../assets/sproot_avatar.png";
import strawberrySproutAvatar from "../../assets/sprout-fraise.png";
import greenVictoryAvatar from "../../assets/sprout-victory.gif";
import strawberryVictoryAvatar from "../../assets/sprout-fraise-victory.gif";
import "../../css/TasksConsultation.css";

function TasksConsultation({ onLogout, userInfo, setUserInfo }) {
  const [tasks, setTasks] = useState({ toDoTasks: [], finishedTasks: [] });
  const currentUser = { role: userInfo?.role };
  const isAdmin = currentUser.role === "ADMIN";
  const [members, setMembers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  // Onglet affiché sur téléphone : "todo" (à faire) ou "done" (terminées)
  const [activeTab, setActiveTab] = useState("todo");
  const fetchTasks = () => {
    getTasks().then((result) => setTasks(result));
  };

  useEffect(() => {
    if (!userInfo) {
      getCurrentUserInfo().then((result) => setUserInfo(result));
    }
    getUsers().then((result) => setMembers(result));
    fetchTasks();
  }, []);

  const onCreate = (taskToCreate) => {
    return createTask(taskToCreate).then(() => fetchTasks());
  };

  const memberName = userInfo?.userName ?? "";
  const memberInitial = memberName ? memberName.charAt(0).toUpperCase() : "";
  const [showCelebration, setShowCelebration] = useState(false);
  const handleCelebrate = () => setShowCelebration(true);

  const finishedCount = tasks.finishedTasks.length;
  const totalCount = tasks.toDoTasks.length + finishedCount;
  //Calcul de la barre de progression avec condition ternaire : si totalCount est égal à zéo, on retourne 0, sinon on fait le calcul de la progression
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((finishedCount / totalCount) * 100);
  return (
    <div className="tasks-consultation-contener">
      <AppHeader
        memberTribe="La Tribu de Bernard"
        memberInitial={memberInitial}
        memberName={memberName}
        onLogout={onLogout}
      />
      {/* Sidebar avatar : nom et points réels via l'API (points à venir)*/}
      <aside className="member-side-bar">
        <MemberSidebar
          avatar={isAdmin ? greenSproutAvatar : strawberrySproutAvatar}
          memberInitial={memberInitial}
          memberName={memberName}
          totalPoints={userInfo?.totalPoint ?? 0}
          progressPercent={progressPercent}
          finishedCount={finishedCount}
          totalCount={totalCount}
        />
      </aside>
      <main className="task-content">
        <div className="task-content-header">
          <h2 className="task-content-title">
            {isAdmin ? "Tâches de la tribu" : "Mes tâches"}
          </h2>
          {isAdmin && <CreateTaskButton onOpen={() => setIsCreating(true)} />}
        </div>
        {isCreating && (
          <CreateTaskModal
            members={members}
            onCreate={onCreate}
            onClose={() => setIsCreating(false)}
          />
        )}
        {/* Onglets : visibles seulement sur téléphone (voir TasksConsultation.css) */}
        <div className="task-tabs">
          <button
            type="button"
            className={`task-tab${activeTab === "todo" ? " active" : ""}`}
            aria-pressed={activeTab === "todo"}
            onClick={() => setActiveTab("todo")}
          >
            À faire · {tasks.toDoTasks.length}
            <img src={leafIcon} alt="" />
          </button>
          <button
            type="button"
            className={`task-tab${activeTab === "done" ? " active" : ""}`}
            aria-pressed={activeTab === "done"}
            onClick={() => setActiveTab("done")}
          >
            Terminées · {finishedCount}
            <img src={flowerIcon} alt="" />
          </button>
        </div>
        <section
          className={`task-list-contener${activeTab === "todo" ? "" : " is-inactive-tab"}`}
        >
          <div className="task-list-section-header">
            <h2 className="tasks-list-title">
              <img src={leafIcon} alt="" />
              Tâches à faire
            </h2>
          </div>

          <TasksList
            tasks={tasks.toDoTasks}
            currentUser={currentUser}
            refreshTasks={fetchTasks}
            onCelebrate={handleCelebrate}
            members={members}
          />
        </section>
        <section
          className={`task-list-contener completed${activeTab === "done" ? "" : " is-inactive-tab"}`}
        >
          <h2 className="tasks-list-title completed">
            <img src={flowerIcon} alt="" /> Tâches terminées
          </h2>
          <TasksList
            tasks={tasks.finishedTasks}
            currentUser={currentUser}
            refreshTasks={fetchTasks}
            onCelebrate={handleCelebrate}
            members={members}
          />
        </section>
        <TaskCelebration
          memberName={memberName}
          victoryGif={isAdmin ? greenVictoryAvatar : strawberryVictoryAvatar}
          show={showCelebration}
          onDone={() => setShowCelebration(false)}
        />
      </main>
    </div>
  );
}

export default TasksConsultation;
