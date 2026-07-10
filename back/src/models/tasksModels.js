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
    console.log("erreur trouvé!");
    console.log(error);
    throw error;
  }
}
export { createTaskModel };
