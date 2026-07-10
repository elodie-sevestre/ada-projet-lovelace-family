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
  // Mettre à jour les détails de la tâche
  const resultTaskDetails = await updateTaskDetailsModel(task_id, task_details);
  // Bloquer la suite si la tâche n'existe pas, pour ne pas assigner un utilisateur à une tâche inexistante
  if (!resultTaskDetails) {
    throw new Error(`La tâche ${task_id} n'existe pas`);
  }
  // Mettre à jour l'utilisateur assigné à la tâche
  await updateTaskAssignedUserModel(task_id, task_details);
  // Renvoyer les détails de la tâche mise à jour
  return resultTaskDetails;
};

export { createTaskServices, updateTaskService };

// Service : contient la logique métier (règles, calculs, validations complexes). Appelle le model pour les données.
