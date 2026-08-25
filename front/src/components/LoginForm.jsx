import { useState } from "react";
import { post } from "../api/client.js";

function LoginForm({ setToken }) {
  // Etats : stocke email, password, message d'erreur
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // indique si la requête est en cours (true = en attente, false = fini)
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
    // désactivation du bouton 'connexion' (la requête peut prendre du temps)
    setLoading(true);
    // nettoie le message d'erreur précédent
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
      if (!response.ok) {
        return { error: "" };
      }
      // Récupère le token de la réponse du serveur
      // localStorage : mémoire navigateur
      // .setItem() : méthode pour écrire ds la mémoire
      // "token" : clé / response.token: valeur de la clé
      localStorage.setItem("token", response.token);

      // mise à jour de l'état dans App.jsx
      setToken(response.token);
    } catch (error) {
      // si la requête échoue, affiche un message d'erreur
      if (error.status === 401) {
        setError("Identifiants invalides");
      } else {
        setError("Errur serveur");
      }
    } finally {
      // réactive le bouton (que ça marche ou que ça échoue)
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          // onChange = mise à jour de l'état quand l'utilisateur tape
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          type="submit"
          // disabled = désactive le bouton si loading est true
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {/* Affiche l'erreur seulement si error n'est pas vide */}
      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginForm;
