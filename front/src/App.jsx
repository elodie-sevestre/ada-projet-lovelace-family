import TaskItem from "./TaskItem.jsx";
import "./App.css";

function App() {
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
      </section>
    </>
  );
}

export default App;
