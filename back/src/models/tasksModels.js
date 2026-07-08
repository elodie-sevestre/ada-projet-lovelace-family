import pool from "./configDb.js";

async function createTaskModel(req) {
  const { name, description, points } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO tasks (name,description,status,points) VALUES ($1, $2, 'A_FAIRE'::status, $3) RETURNING *`,
    [name, description, points],
  );
  console.log(rows[0]);
  return rows[0];
}

const updateTaskDetailsModel = async (task_id, task_details) => {
  // faire try/catch et voir pour throw
  // contrôler que la tâche existe bien (task_id) : mettre ubn message clair et limpide
  // erreur 500 : pb connection db
  // erreur 500 : j'essaie d'updater un tâche qui n'existe pas
  console.log(task_id, task_details);
  console.log("recupération du body dans update task model");

  const { name, description, status, points } = task_details;
  const { rows } = await pool.query(
    `UPDATE tasks SET (name,description,status,points) = ($1, $2, $3::status, $4) WHERE id=$5 RETURNING *`,
    [name, description, status, points, task_id],
  );
  console.log("affichage du retour de l'update donc pas encore hourra");

  console.log(rows);
  return rows[0];
};

export { createTaskModel, updateTaskDetailsModel };

// Model: accès aux données uniquement (requêtes SQL ou ORM).
