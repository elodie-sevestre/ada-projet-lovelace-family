import {
  createTaskModel,
  updateTaskDetailsModel,
  updateTaskUserAssignedModel,
} from "../models/tasksModels.js";

async function createTaskServices(req) {
  const stepModel = await createTaskModel(req);
  console.log("stepModel");
  console.log(stepModel);
  return stepModel;
}

const updateTaskDetailsService = (res, req) => {};
const updateTaskUserAssignedService = (res, req) => {};

export {
  createTaskServices,
  updateTaskDetailsService,
  updateTaskUserAssignedService,
};

// Service : contient la logique métier (règles, calculs, validations complexes). Appelle le model pour les données.
