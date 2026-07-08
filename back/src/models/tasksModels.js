import pool from "./configDb.js";

async function getAllTasksModel() {
  const { rows } = await pool.query(`SELECT
      t.id,
      t.name AS task_name,
      t.description,
      t.points AS points,
      t.status,
      STRING_AGG(u.name, ', ') AS assigned_to
  FROM tasks t
  LEFT JOIN users_tasks ut ON t.id = ut.task_id
  LEFT JOIN users u ON ut.user_id = u.id
  GROUP BY t.id
  ORDER BY t.created_at ASC;`);
  console.log("Vérifier le tri group by");
  console.log(rows);
  return rows;
}

async function getTasksByUserModel(userId) {
  const { rows } = await pool.query(
    `SELECT
    t.id,
    t.name as task_name,
    t.points AS points,
    t.status,
    STRING_AGG(u.name, ', ') AS assigned_to
  FROM tasks t
  JOIN users_tasks ut ON t.id = ut.task_id
  JOIN users u ON ut.user_id = u.id
  WHERE ut.user_id = $1
  GROUP BY t.id
  ORDER BY t.created_at
    `,
    [userId],
  );
  return rows;
}

export { getAllTasksModel, getTasksByUserModel };
