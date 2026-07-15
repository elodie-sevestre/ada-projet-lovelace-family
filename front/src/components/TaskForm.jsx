import { useState } from "react";
import "../css/TaskForm.css";

// members : liste des membres reçue du parent
// onCreate : fonction qui crée la tâche côté parent/API
// onClose : fonction qui ferme le formulaire
function TaskForm({ members, onCreate, onClose }) {
  // **State du formulaire

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assignment, setAssignment] = useState("");
  const [points, setPoints] = useState("");
  const [error, setError] = useState("");

  // **Validations

  // Le nom ne doit pas être vide
  const isNameValid = name.trim() !== "";

  // Un membre doit être sélectionné
  const isAssignmentValid = assignment !== "";

  // Les points doivent être un entier >= 1 / regex /^\d+$/ traduction="La chaîne doit contenir uniquement un ou plusieurs chiffres du début à la fin."
  const isPointsValid = /^\d+$/.test(points) && Number(points) >= 1;

  // Le formulaire est valide seulement si toutes les conditions sont remplies
  const isFormValid = isNameValid && isAssignmentValid && isPointsValid;

  // **Annulation du formulaire

  const handleCancel = () => {
    // Réinitialisation des champs
    setName("");
    setDescription("");
    setAssignment("");
    setPoints("");
    setError("");

    // Ferme le formulaire si la fonction existe
    if (onClose) {
      onClose();
    }
  };

  // **Soumission du formulaire

  const handleSubmit = async (e) => {
    // Empêche le rechargement de la page
    e.preventDefault();

    // **Vérifie la validité du formulaire
    if (!isFormValid) {
      setError("Nom, membre assigné et points sont obligatoires.");
      return;
    }

    // Efface les erreurs précédentes
    setError("");

    // Objet envoyé au backend
    const task = {
      name: name.trim(),
      description: description.trim() || null,
      assignment,
      points: Number(points),
      status: "A_FAIRE",
    };

    try {
      // **Création de la tâche
      await onCreate(task);

      // **Réinitialisation du formulaire
      setName("");
      setDescription("");
      setAssignment("");
      setPoints("");

      // **Fermeture du formulaire après création
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError("Erreur lors de la création de la tâche.");
      console.error(err);
    }
  };
  //**  Affichage

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {/* En-tête du formulaire */}
      <div className="task-form-header">
        <h2>Nouvelle tâche</h2>

        {/* Bouton fermeture */}
        <button type="button" className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Nom */}
      <div className="form-group">
        <label htmlFor="name">Nom de la tâche</label>

        <input
          id="name"
          className="form-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">Description</label>

        <textarea
          id="description"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Points */}
      <div className="form-group">
        <label htmlFor="points">Points</label>

        <input
          id="points"
          className="form-input"
          type="number"
          min="1"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
      </div>

      {/* Membre assigné */}
      <div className="form-group">
        <label htmlFor="assignment">Membre assigné</label>

        <select
          id="assignment"
          className="form-select"
          value={assignment}
          onChange={(e) => setAssignment(e.target.value)}
        >
          <option value="">Choisir un membre</option>

          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {/* Message d'erreur */}
      {error && <p className="error-message">{error}</p>}

      {/* Boutons d'action */}
      <div className="form-actions">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!isFormValid}
        >
          Créer
        </button>

        <button
          className="btn btn-secondary"
          type="button"
          onClick={handleCancel}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
