import pool from "./configDb.js";

async function createTaskModel(name, description, points) {
  // const { name, description, points } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO tasks (name,description,status,points) VALUES ($1, $2, 'A_FAIRE'::status, $3) RETURNING *`,
    [name, description, points],
  );

  return rows[0];
}
export { createTaskModel };
