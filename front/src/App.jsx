// import TaskItem from "./components/TaskItem.jsx";

import TasksConsultation from "./components/TasksConsultation.jsx";

import "./App.css";
import TaskForm from "./components/TaskForm.jsx";
import { createTask } from "./api/tasks.js";
import { getUsers } from "./api/users.js";
import { useEffect, useState } from "react";
function App() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getUsers().then((result) => setMembers(result));
  }, []);
  console.log(members);
  // const memberss = [
  //   {
  //     id: 1,
  //     name: "Bernard",
  //   },
  // ];
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
