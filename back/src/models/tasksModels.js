function createTaskModel(req) {
  const { name, description, status, points } = req.body;
  // const { rows } = await pool.query
  console.log(
    "INSERT INTO tasks (name,description,status,points) VALUES ($1, $2, 'à faire', $4) RETURNING*",
    [name, description, status, points],
  );
}
export default { createTaskModel };
