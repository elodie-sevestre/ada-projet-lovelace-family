import { useState } from "react";
import TaskItem from "./components/TaskItem.jsx";
import EditTaskButton from "./components/EditTaskButton.jsx";
import EditTaskForm from "./components/EditTaskForm.jsx";
import "./App.css";

function App() {
  const [isEditOpen, setIsEditOpen] = useState(false);

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
        <EditTaskButton
          task={{
            task_name: "Faire la vaisselle",
            description:
              "Mettre une pastille dans le réservoir du lave vaisselle et lancer un cycle en mode eco",
            points: 5,
            status: "A_FAIRE",
            assigned_user_ids: [0],
          }}
          onEdit={() => setIsEditOpen(true)}
        ></EditTaskButton>
        {isEditOpen && (
          <EditTaskForm
            task={{
              task_name: "Faire la vaisselle",
              description:
                "Mettre une pastille dans le réservoir du lave vaisselle et lancer un cycle en mode eco",
              points: 5,
              status: "A_FAIRE",
              assigned_user_ids: [0],
            }}
          />
        )}
      </section>
    </>
  );
}

export default App;
