import TaskModalItem from "./TaskModalItem.jsx";
import "./App.css";

function App() {
  return (
    <>
      <section id="center">
        <TaskModalItem
          task={{
            task_name: "Faire la vaisselle",
            description: "après manger",
            created_at: "2026-07-10",
            updated_at: "2026-07-12",
            status: "a_faire",
            assigned_to: "Léa",
            points: 10,
          }}
          onClose={() => console.log("fermeture")}
        />
      </section>
    </>
  );
}

export default App;
