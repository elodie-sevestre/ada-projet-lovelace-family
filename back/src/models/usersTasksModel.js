import pool from "./configDb.js";

const updateTaskAssignedUserModel = async (task_id, task_details) => {
  // Réserver une connexion à la base de données, rien que pour cette fonction
  const client = await pool.connect();
  try {
    const { user_id } = task_details;
    // Démarrer la transaction : les requêtes suivantes forment un seul bloc
    await client.query("BEGIN");
    // Enlever l'ancien utilisateur assigné à la tâche
    await client.query(`DELETE FROM users_tasks WHERE task_id=$1`, [task_id]);
    // Assigner le nouvel utilisateur à la tâche
    await client.query(
      `INSERT INTO users_tasks (task_id, user_id) VALUES ($1, $2)`,
      [task_id, user_id],
    );
    // Valider les deux actions : elles ont réussi
    await client.query("COMMIT");
  } catch (error) {
    // Annuler tout si une des deux actions a échoué
    await client.query("ROLLBACK");
    // Relancer l'erreur avec un message clair, en gardant le message d'origine
    throw new Error(
      `Impossible de changer l'utilisateur de la tâche : ${error.message}`,
    );
  } finally {
    // Rendre la connexion, que la transaction ait réussi ou échoué
    client.release();
  }
};
// Nouvelle fonction : lier une tâche à un membre à la CRÉATION
const createTaskAssignedUserModel = async (task_id, user_id) => {
  try {
    await pool.query(
      `INSERT INTO users_tasks (task_id, user_id) VALUES ($1, $2)`,
      [task_id, user_id],
    );
  } catch (error) {
    throw new Error(
      `Impossible d'assigner le membre à la tâche : ${error.message}`,
    );
  }
};

export { updateTaskAssignedUserModel, createTaskAssignedUserModel };
