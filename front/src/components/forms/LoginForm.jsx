import { useState } from "react";
import { post } from "../../api/client.js";
import logoSproutQuest from "../../assets/logo-sprout-quest.png";
import "../../css/LoginForm.css";

function LoginForm({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validatedEmail(email) {
    if (!email.includes("@") || !email.includes(".")) {
      return "Format de l'email invalide";
    }
    return null;
  }

  function validatedPassword(password) {
    if (password.length < 8) {
      return "Format du mot de passe invalide";
    }
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const emailError = validatedEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    const passwordError = validatedPassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const response = await post("/auth/connexion", {
        mail: email,
        password: password,
      });
      localStorage.setItem("token", response.token);
      setToken(response.token);
    } catch (error) {
      if (error.status === 401) {
        setError("Identifiants invalides");
      } else {
        setError("Erreur serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-component">
      <img className="logo-connexion" src={logoSproutQuest}></img>
      <h1>Connexion</h1>
      <div className="login-form-content">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
      <div className="login-form-error-message">{error && <p>{error}</p>}</div>
    </div>
  );
}

export default LoginForm;
