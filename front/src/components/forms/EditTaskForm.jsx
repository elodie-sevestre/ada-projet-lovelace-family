import { useState } from "react";
import { editTask } from "../../api/tasks.js";
import "../../css/EditTaskForm.css";

const EditTaskForm = ({ task, onClose, refreshTasks }) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedTask = {
      name: editName,
      description: editDescription || null,
      status: editStatus,
      points: editPoints,
      user_id: editUserId,
    };
    editTask(task.id, updatedTask).then(() => {
      onClose();
      refreshTasks();
    });
  };

  return (
    <>
      <form className="app-modal" onSubmit={handleSubmit}>
        {/* En-tête du formulaire */}
        <h2 className="app-modal-tab">Modifier une tâche</h2>
        {/* Bouton fermeture */}
        <div className="app-modal-card">
          <button type="button" className="app-modal-close" onClick={onClose}>
            ✕
          </button>

          <div className="form-group">
            <label> Nom de la tâche</label>
            <input
              type="text"
              className="form-input"
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label> Description</label>
            <textarea
              maxLength={255}
              className="form-textarea"
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label> Points</label>
            <input
              type="number"
              className="task-input"
              value={editPoints}
              onChange={(event) => setEditPoints(event.target.valueAsNumber)}
            />
          </div>

          <div className="form-group">
            <label> Statut </label>
            <select
              className="form-select"
              value={editStatus}
              onChange={(event) => setEditStatus(event.target.value)}
            >
              <option value={"A_FAIRE"}>A faire</option>
              <option value={"TERMINE"}>Terminée</option>
            </select>
          </div>

          <div className="form-group">
            <label> Assignation</label>
            <select
              className="form-select"
              value={editUserId}
              onChange={(event) => setEditUserId(Number(event.target.value))}
            >
              {usersList}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Modifier
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditTaskForm;
