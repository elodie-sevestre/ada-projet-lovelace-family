async function getAllTasksController(req, res) {
  try {
    const tasks = await getAllTasksService();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
