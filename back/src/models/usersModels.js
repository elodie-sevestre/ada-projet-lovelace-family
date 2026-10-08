import pool from './configDb.js';

async function getAllUsersModel() {
  const { rows } = await pool.query(
    `SELECT id, name, role, total_points FROM users`
  );
  return rows;
}

async function getUserByTokenModel(userInfo) {
  const { rows } = await pool.query(
    `SELECT id, name, role, total_points FROM users WHERE id = $1`,
    [userInfo.userId]
  );
  return rows[0];
}

export { getAllUsersModel, getUserByTokenModel };
