import TaskItem from "./TaskItem.jsx";
import "../css/TasksList.css";

function TasksList({ tasks, currentUser }) {
  return (
    <div className="tasks-list-contener">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} currentUser={currentUser} />
      ))}
    </div>
  );
}

export default TasksList;
