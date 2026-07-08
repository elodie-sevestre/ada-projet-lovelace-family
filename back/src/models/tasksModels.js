import pool from "./configDb.js";

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

export { getAllTasksModel, getTasksByUserModel };
