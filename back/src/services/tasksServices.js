import { createTaskModel } from "../models/tasksModels.js";

async function createTaskServices(req) {
  const stepModel = await createTaskModel(req);
  console.log("stepModel");
  console.log(stepModel);
  return stepModel;
}

export { createTaskServices };
