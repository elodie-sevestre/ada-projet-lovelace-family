import pool from './configDb.js';

const updateTaskAssignedUserModel = async (task_id, task_details) => {
  // Réserver une connexion à la base de données, rien que pour cette fonction
  const client = await pool.connect();
  try {
    const { user_id } = task_details;
    // Démarrer la transaction : les requêtes suivantes forment un seul bloc
    await client.query('BEGIN');
    // Enlever l'ancien utilisateur assigné à la tâche
    await client.query(`DELETE FROM users_tasks WHERE task_id=$1`, [task_id]);
    // Assigner le nouvel utilisateur à la tâche
    await client.query(
      `INSERT INTO users_tasks (task_id, user_id) VALUES ($1, $2)`,
      [task_id, user_id]
    );
    // Valider les deux actions : elles ont réussi
    await client.query('COMMIT');
  } catch (error) {
    // Annuler tout si une des deux actions a échoué
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // Rendre la connexion, que la transaction ait réussi ou échoué
    client.release();
  }
};
// Nouvelle fonction : lier une tâche à un membre à la CRÉATION
const createTaskAssignedUserModel = async (task_id, user_id) => {
  await pool.query(
    `INSERT INTO users_tasks (task_id, user_id) VALUES ($1, $2)`,
    [task_id, user_id]
  );
};

// NOUVEAU : indique si une tâche est assignée à un utilisateur donné.
// SELECT 1 : on ne veut pas les données, juste savoir si une ligne existe.
// rowCount > 0 => true (la tâche est bien assignée à cet utilisateur).

const isTaskAssignedToUserModel = async (taskId, userId) => {
  const { rowCount } = await pool.query(
    `SELECT 1 FROM users_tasks WHERE task_id = $1 AND user_id = $2`,
    [taskId, userId]
  );
  return rowCount > 0;
};

export {
  updateTaskAssignedUserModel,
  createTaskAssignedUserModel,
  isTaskAssignedToUserModel,
};
