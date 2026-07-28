import pool from "./configDb.js";

const createLoginModel = async (
  role,
  name,
  mail,
  tribe_name,
  password_hash,
) => {
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (role, name, mail, tribe_name, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [role, name, mail, tribe_name, password_hash],
    );
    // console.log(rows);
    return rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default createLoginModel;
