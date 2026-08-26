import { useState } from "react";
import LoginForm from "./components/LoginForm.jsx";
import TasksConsultation from "./components/TasksConsultation.jsx";

import "./App.css";

function App() {
  // on récupère le token du localStorage
  const [token, setToken] = useState(() => {
    // console.log("Mon token : ", localStorage.getItem("token"));
    return localStorage.getItem("token");
  });

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <>
      <section id="center">
        {token ? (
          <TasksConsultation token={token} onLogout={handleLogout} />
        ) : (
          <LoginForm setToken={setToken} />
        )}
      </section>
    </>
  );
}

export default App;
