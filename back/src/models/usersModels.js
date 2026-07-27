import pool from "./configDb.js";

async function getAllUsersModel() {
  const { rows } = await pool.query(`SELECT * FROM users`);
  console.log(rows);
  return rows;
}

export default getAllUsersModel;
