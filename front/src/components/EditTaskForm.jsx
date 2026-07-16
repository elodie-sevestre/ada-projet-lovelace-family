// Formulaire pour modifier une tâche

// récupérer le bouton modifier
// qd je clique sur le bouton modifier, un pop-up apparait pour modifier la tâche
// les champs name, description, points, status et assigantion sont pré-remplis
// récupérer l'état de chaque champs
// l'utilisateur modifie les champs manuellement
//todo l'utilisateur peut cliquer soit
//todo sur le bouton enregistrer -> modification de la bdd (ajouter un toast de qqs secondes pour pouvoir annuler si clique par erreur)
//todo sur le bouton annuler

import { useState } from "react";
import "../css/EditTaskForm.css";

const EditTaskForm = ({ task, onClose, refreshTasks }) => {
  const [editName, setEditName] = useState(task.task_name);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPoints, setEditPoints] = useState(task.points);
  const [editStatus, setEditStatus] = useState(task.status);
  const [editUserId, setEditUserId] = useState(task.assigned_user_ids[0]);

  // lister les utilisateurs sans fetch
  const usersName = [
    { id: 1, name: "Bernard" },
    { id: 2, name: "Léa" },
  ];
  const usersList = usersName.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  const handleSubmit = (event) => {
    event.preventDefault();
    const fetchOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        description: editDescription,
        status: editStatus,
        points: editPoints,
        user_id: editUserId,
      }),
    };
    fetch(`http://localhost:5000/api/tasks/${task.id}`, fetchOptions)
      .then((response) => response.json())
      .then(() => {
        onClose();
        refreshTasks();
      });
  };

  return (
    <>
      <form className="edit-task-form" onSubmit={handleSubmit}>
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
          Description
          <textarea
            maxLength={255}
            className="task-description"
            value={editDescription}
            onChange={(event) => setEditDescription(event.target.value)}
          />
        </label>
        <label>
          {" "}
          Points
          <input
            type="number"
            className="task-points"
            value={editPoints}
            onChange={(event) => setEditPoints(event.target.valueAsNumber)}
          />
        </label>
        <label>
          {" "}
          Statut
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
          Assignation
          <select
            className="user-id"
            value={editUserId}
            onChange={(event) => setEditUserId(Number(event.target.value))}
          >
            {usersList}
          </select>
        </label>
        <button type="submit">Enregistrer</button>
        <button type="button" className="cancel-edit-form" onClick={onClose}>
          Annuler
        </button>
      </form>
    </>
  );
};

export default EditTaskForm;
