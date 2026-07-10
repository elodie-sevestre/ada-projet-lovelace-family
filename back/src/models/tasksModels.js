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
  try {
    const { name, description, status, points } = task_details;
    // Mettre à jour la tâche en base et récupérer la ligne modifiée
    const { rows } = await pool.query(
      `UPDATE tasks SET (name,description,status,points) = ($1, $2, $3::status, $4) WHERE id=$5 RETURNING *`,
      [name, description, status, points, task_id],
    );
    // Renvoyer la tâche mise à jour, ou undefined si aucune tâche ne correspond à cet id
    return rows[0];
  } catch (error) {
    // Attraper toute erreur technique (connexion DB, valeur invalide pour l'enum status, etc.)
    throw new Error(`Impossible de modifier la tâche : ${error.message}`);
  }
};

export { createTaskModel, updateTaskDetailsModel };

// Model: accès aux données uniquement (requêtes SQL ou ORM).
