import createTaskModel from "../models/tasksModels.js";

function createTaskServices(req) {
  createTaskModel(req);
}

export default { createTaskServices };
