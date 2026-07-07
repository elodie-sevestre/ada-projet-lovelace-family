import pool from "./configDb.js";

async function getAllTasksModel() {
  //   const { rows } = await pool.query(`SELECT
  //     t.id,
  //     t.name AS task_name,
  //     t.description,
  //     t.points AS points,
  //     t.status,
  //     STRING_AGG(u.name, ', ') AS asigned_to
  // FROM tasks t
  // LEFT JOIN users_tasks ut ON t.id = ut.task_id
  // LEFT JOIN users u ON ut.user_id = u.id
  // WHERE t.status = 'à faire'
  // GROUP BY t.id, t.name, t.description, t.points, t.status, t.created_at
  // ORDER BY t.created_at ASC;`);
  //   return rows;

  console.log(`import pool from "./configDb.js";
import { getAllTasksService } from "../services/tasksServices.js";

async function getAllTasksModel() {
  const { rows } = await pool.query("SELECT 
    t.id,
    t.name AS task_name,
    t.description,
    t.points AS points,
    t.status,
    STRING_AGG(u.name, ', ') AS asigned_to
FROM tasks t
LEFT JOIN users_tasks ut ON t.id = ut.task_id
LEFT JOIN users u ON ut.user_id = u.id
WHERE t.status = 'à faire'
GROUP BY t.id, t.name, t.description, t.points, t.status, t.created_at
ORDER BY t.created_at ASC;");
}

export { getAllTasksService };
`);
}

export { getAllTasksModel };
