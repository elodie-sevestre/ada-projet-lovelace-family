// Modification d'une tâche

// récupérer le bouton modifier
// qd je clique sur le bouton modifier, un pop-up apparait pour modifier la tâche
// les champs name, description, points, status et assigantion sont pré-remplis
// récupérer l'état de chaque champs
// l'utilisateur modifie les champs manuellement
// l'utilisateur peut cliquer soit
// sur le bouton enregistrer -> modification de la bdd (ajouter un toast de qqs secondes pour pouvoir annuler si clique par erreur)
// sur le bouton annuler

// exemple : bouton modifier dans adahsboard

/* CategoryCard.jsx

const [editMode, setEditMode] = useState(false);
const [editName, setEditName] = useState(category.name);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${API_URL}/categories/${category.id}/skills`);
      const data = await response.json();
      setSkills(data);
    } catch (err) {
      console.error("Erreur :", err);
      onError("Impossible de charger les compétences.");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [category.id]);

<input
            type="text"
            className="category-name-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName();
              if (e.key === "Escape") { setEditMode(false); setEditName(category.name); }
            }}
            aria-label="Modifier le nom de la catégorie"
            autoFocus
          />

<button
          className="btn-category-edit"
          onClick={() => setEditMode(true)}
          aria-label={`Modifier le nom de la catégorie ${category.name}`}
        ></button>

*/

import { useState } from "react";

const EditTaskForm = ({ task }) => {
  const [editName, setEditName] = useState(task.task_name);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPoints, setEditPoints] = useState(task.points);
  const [editStatus, setEditStatus] = useState(task.status);
  const [editUserId, setEditUserId] = useState(task.assigned_user_ids[0]);

  const usersName = [
    { id: 1, name: "Bernard" },
    { id: 2, name: "Léa" },
  ];
  const usersList = usersName.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <>
      <label>
        {" "}
        Nom de la tâche
        <input
          type="text"
          className="task-name"
          value={editName}
          onChange={(event) => setEditName(event.target.value)}
        />
      </label>
      <label>
        {" "}
        Description de la tâche
        <textarea
          maxLength={255}
          className="task-description"
          value={editDescription}
          onChange={(event) => setEditDescription(event.target.value)}
        />
      </label>
      <label>
        {" "}
        Nombre de points attribués
        <input
          type="number"
          className="task-points"
          value={editPoints}
          onChange={(event) => setEditPoints(event.target.valueAsNumber)}
        />
      </label>
      <label>
        {" "}
        Statut de la tâche
        <select
          className="task-status"
          value={editStatus}
          onChange={(event) => setEditStatus(event.target.value)}
        >
          <option value={"A_FAIRE"}>A faire</option>
          <option value={"TERMINE"}>Terminée</option>
        </select>
      </label>
      <label>
        {" "}
        Membre assigné
        <select
          className="user-id"
          value={editUserId}
          onChange={(event) => setEditUserId(Number(event.target.value))}
        >
          {usersList}
        </select>
      </label>
    </>
  );
};

export default EditTaskForm;
