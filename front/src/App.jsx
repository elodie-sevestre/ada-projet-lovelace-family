import TaskItem from "./components/TaskItem.jsx";
import "./App.css";

// import pour simuler modification tâche
import { useState } from "react";
import EditTaskButton from "./components/EditTaskButton.jsx";
import EditTaskForm from "./components/EditTaskForm.jsx";

function App() {
  // useState pour éditer formulaire de modification
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

        {/* Simulation du comportoment du bouton modifier */}
        <EditTaskButton
          task={{
            task_name: "Faire la vaisselle",
            description:
              "Mettre une pastille dans le réservoir du lave vaisselle et lancer un cycle en mode eco",
            points: 5,
            status: "A_FAIRE",
            assigned_user_ids: [0],
          }}
          // props onEdit permet de mettre à jour le statut d'affichage du formulaire qd on clique
          onEdit={() => setIsEditOpen(true)}
        ></EditTaskButton>
        {/* simulation pour masquer au départ le formulaire de modification */}
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
