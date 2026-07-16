import TaskItem from "./components/TaskItem.jsx";

import TasksConsultation from "./components/TasksConsultation.jsx";

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
        <TaskForm onCreate={createTask} members={members} />
        <TasksConsultation />
      </section>
    </>
  );
}

export default App;
