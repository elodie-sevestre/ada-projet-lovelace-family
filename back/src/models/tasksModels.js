import pool from "./configDb.js";

function createTaskModel(req) {
  const { name, description, points } = req.body;
  const { rows } = pool.query(
    `INSERT INTO tasks (name,description,status,points) VALUES ($1, $2, 'à faire', $3) RETURNING *`,
    [name, description, points],
  );
  return rows[0];
}
export { createTaskModel };
