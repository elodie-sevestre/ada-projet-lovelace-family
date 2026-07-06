import { createTaskServices } from "../services/tasksServices.js";

function createTaskController(req, res) {
  createTaskServices(req);
  res.status(201).json();
}
export { createTaskController };
