import { createTaskModel } from "../models/tasksModels.js";

async function createTaskServices(name, description, points) {
  const stepModel = await createTaskModel(name, description, points);
  return stepModel;
}
export { createTaskServices };
