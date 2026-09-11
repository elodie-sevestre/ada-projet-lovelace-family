import { useState } from "react";
import LoginForm from "./components/forms/LoginForm.jsx";
import TasksConsultation from "./components/tasks/TasksConsultation.jsx";
import { getToken, clearToken } from "./lib/session.js";
import "./App.css";

function App() {
  const [token, setToken] = useState(getToken());
  function handleLogout() {
    clearToken();
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
