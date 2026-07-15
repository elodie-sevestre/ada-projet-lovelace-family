import TaskItem from "./components/TaskItem.jsx";
import "./App.css";
import TaskForm from "./components/TaskForm.jsx";
import { createTask } from "./api/tasks.js";

function App() {
  const members = [
    {
      id: 1,
      name: "Bernard",
    },
  ];

  return (
    <>
      <section id="center">
        <TaskItem
          task={{
            task_name: "Faire la vaisselle",
            assigned_to: "Léa",
            points: 10,
          }}
          currentUser={{ role: "ADMIN" }}
        ></TaskItem>
        <TaskForm onCreate={createTask} members={members} />
      </section>
    </>
  );
}

export default App;
