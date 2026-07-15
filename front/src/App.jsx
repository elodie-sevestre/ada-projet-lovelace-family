import TaskItem from "./components/TaskItem.jsx";

import TasksConsultation from "./components/TasksConsultation.jsx";

import "./App.css";

function App() {
  return (
    <>
      <section id="center">
        {/* <TaskItem
          task={{
            id: 3,
            task_name: "Faire la vaisselle",
            assigned_to: "Léa",
            points: 10,
            description:
              "Mettre une pastille dans le réservoir du lave vaisselle et lancer un cycle en mode eco",
            status: "A_FAIRE",
            // valeur 2 correspond à l'id 2 du seed de la table users
            assigned_user_ids: [2],
          }}
          currentUser={{ role: "ADMIN" }} */}
        {/* /> */}
        <TasksConsultation />
      </section>
    </>
  );
}

export default App;
