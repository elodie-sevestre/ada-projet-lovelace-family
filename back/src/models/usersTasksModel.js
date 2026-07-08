import pool from "./configDb.js";

const updateTaskAssignedUserModel = async (task_id, task_details) => {
  try {
    // modifier la table users_tasks
    // 1ere requête : DELETE tasks
    // 2eme requête : INSERT nouvelle ligne
    const { user_id } = task_details;
    console.log(user_id);

    await pool.query(`DELETE FROM users_tasks WHERE task_id=$1`, [task_id]);
    await pool.query(
      `INSERT INTO users_tasks (task_id, user_id) VALUES ($1, $2)`,
      [task_id, user_id],
    );
    console.log("hourra");
  } catch (error) {
    // à remplir
  }
};

export { updateTaskAssignedUserModel };
