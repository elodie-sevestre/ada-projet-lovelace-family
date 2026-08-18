import pool from './configDb.js';

const createLoginModel = async (
  role,
  name,
  mail,
  tribe_name,
  password_hash
) => {
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (role, name, mail, tribe_name, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [role, name, mail, tribe_name, password_hash]
    );
    // console.log(rows);
    return rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserByEmail = async (mail) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE mail = $1', [
      mail,
    ]);
    return rows[0]; // undefined si aucun utilisateur trouvé
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { createLoginModel, findUserByEmail };
