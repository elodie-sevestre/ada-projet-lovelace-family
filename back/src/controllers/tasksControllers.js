import createTaskServices from "../services/tasksServices.js";

function createTaskController(req, res) {
  createTaskServices(req);
}
export default { createTaskController };
