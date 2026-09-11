import pool from './configDb.js';

async function getAllUsersModel() {
  const { rows } = await pool.query(
    `SELECT id, name, role, total_points FROM users`
  );
  return rows;
}

export default getAllUsersModel;
