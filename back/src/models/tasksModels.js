import pool from "./configDb.js";

async function createTaskModel(name, description, points) {
  try {
    const { rows } = await pool.query(
      `INSERT INTO tasks (name,description,status,points) VALUES ($1, $2, 'A_FAIRE'::status, $3) RETURNING *`,
      [name, description, points],
    );
    console.log("erreur pas trouvé :'(");
    return rows[0];
  } catch (error) {
    throw error;
  }
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

//Requête pour récupérer toutes les tâches:
async function getAllTasksModel() {
  const { rows } = await pool.query(`SELECT
      t.id,
      t.name AS task_name,
      t.description,
      t.points AS points,
      t.status,
      STRING_AGG(u.name, ', ') AS assigned_to,
      ARRAY_AGG(u.id) AS assigned_user_ids
  FROM tasks t
  LEFT JOIN users_tasks ut ON t.id = ut.task_id
  LEFT JOIN users u ON ut.user_id = u.id
  GROUP BY t.id
  ORDER BY t.created_at ASC;`);
  return rows;
}

//Requête pour récupérer toutes les tâches d'un utilisateur :
async function getTasksByUserModel(userId) {
  const { rows } = await pool.query(
    `SELECT
    t.id,
    t.name as task_name,
    t.points AS points,
    t.status,
    STRING_AGG(u.name, ', ') AS assigned_to,
    ARRAY_AGG(u.id) AS assigned_user_ids
  FROM tasks t
  JOIN users_tasks ut ON t.id = ut.task_id
  JOIN users u ON ut.user_id = u.id
  WHERE ut.user_id = $1
  GROUP BY t.id
  ORDER BY t.created_at
    `,
    [userId], //Attention à ne pas oublier de passer userId en paramètres de la pool query (WHERE ... $1)
  );
  return rows;
}

export {
  createTaskModel,
  updateTaskDetailsModel,
  getAllTasksModel,
  getTasksByUserModel,
};
