import { createTaskServices } from "../services/tasksServices.js";

async function createTaskController(req, res) {
  const rows = await createTaskServices(req);
  console.log("rows");
  console.log(rows);
  res.status(201).json(rows);
}
export { createTaskController };
