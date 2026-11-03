import starIcon from "../../assets/icon_points.png";
import leafIcon from "../../assets/leaf_icon.png";
import "../../css/TasksEmptyState.css";

// Message affiché à la place de la liste quand il n'y a plus de tâche à faire
// memberName : prénom affiché dans le message de félicitations
// hasFinishedTasks : true si des tâches ont déjà été terminées
// isAdmin : l'admin voit les tâches de toute la tribu et peut en créer
function TasksEmptyState({ memberName, hasFinishedTasks, isAdmin }) {
  // Tout a été fait : on félicite. Aucune tâche du tout : message d'attente.
  // L'admin a son propre texte qui l'invite à créer la suite
  let text;
  if (hasFinishedTasks) {
    text = isAdmin
      ? "La tribu a tout coché. Lance la prochaine quête avec « Ajouter une tâche »."
      : `Tout est coché, ${memberName}. Ta tribu peut être fière de toi !`;
  } else {
    text = isAdmin
      ? "Aucune quête pour le moment. Ajoute une tâche pour lancer l'aventure de la tribu !"
      : "Aucune quête pour le moment.";
  }

  const message = hasFinishedTasks
    ? { icon: starIcon, title: "Quête accomplie !", text }
    : { icon: leafIcon, title: "Rien à l'horizon…", text };

  return (
    <div className="tasks-empty-state">
      <div className="tasks-empty-state-icon">
        <img src={message.icon} alt="" />
      </div>
      <p className="tasks-empty-state-title">{message.title}</p>
      <p className="tasks-empty-state-text">{message.text}</p>
    </div>
  );
}

export default TasksEmptyState;
