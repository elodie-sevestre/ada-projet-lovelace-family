import { useState } from "react";
import { post } from "../../api/client.js";
import { saveToken } from "../../lib/session.js";
import logoSproutQuest from "../../assets/logo-sprout-quest.png";
import "../../css/LoginForm.css";

function LoginForm({ setToken, setUserInfo }) {
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
      saveToken(response.token);
      setToken(response.token);
      setUserInfo(response.userInfo);
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
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="toi@exemple.fr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="8 caractères minimum"
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
