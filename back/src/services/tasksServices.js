import {
  createTaskModel,
  updateTaskDetailsModel,
} from "../models/tasksModels.js";

import { updateTaskAssignedUserModel } from "../models/usersTasksModel.js";

async function createTaskServices(req) {
  const stepModel = await createTaskModel(req);
  console.log("stepModel");
  console.log(stepModel);
  return stepModel;
}

const updateTaskService = async (task_id, task_details) => {
  // si updateTaskModel ne fonctionne pas, il ne faut pas qu'on puisse lancer updateTaskAssignedUserModel
  const resultTaskDetails = await updateTaskDetailsModel(task_id, task_details);
  await updateTaskAssignedUserModel(task_id, task_details);
  return resultTaskDetails;
  // si la réponse est nulle, j'indique que je n'ai pas pu mettre à jour
  // sinon c'est à jour!
};

export { createTaskServices, updateTaskService };

// Service : contient la logique métier (règles, calculs, validations complexes). Appelle le model pour les données.
