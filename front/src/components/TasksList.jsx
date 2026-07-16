import TaskItem from "./TaskItem.jsx";
import "../css/TasksList.css";

function TasksList({ tasks, currentUser, refreshTasks }) {
  return (
    <div className="tasks-list-contener">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          currentUser={currentUser}
          refreshTasks={refreshTasks}
        />
      ))}
    </div>
  );
}

export default TasksList;
