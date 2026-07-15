import {
  createTaskModel,
  updateTaskDetailsModel,
  getAllTasksModel,
  getTasksByUserModel,
} from "../models/tasksModels.js";

import { updateTaskAssignedUserModel } from "../models/usersTasksModel.js";

async function createTaskServices(name, description, points) {
  const stepModel = await createTaskModel(name, description, points);
  return stepModel;
}

const updateTaskService = async (task_id, task_details) => {
  // Mettre à jour les détails de la tâche
  const resultTaskDetails = await updateTaskDetailsModel(task_id, task_details);
  // Bloquer la suite si la tâche n'existe pas, pour ne pas assigner un utilisateur à une tâche inexistante
  if (!resultTaskDetails) {
    const error = new Error(`La tâche ${task_id} n'existe pas`);
    error.statusCode = 404;
    throw error;
  }
  // Mettre à jour l'utilisateur assigné à la tâche
  await updateTaskAssignedUserModel(task_id, task_details);
  // Renvoyer les détails de la tâche mise à jour
  return resultTaskDetails;
};

//Service pour scinder les toutes les tâches récupérées en deux tableaux distincts"à faire" et "Terminées"
async function getAllTasksService() {
  const tasks = await getAllTasksModel();
  // Je veux stocker les tâches à faire dans un nouveau tableau
  const toDoTasks = tasks.filter((task) => task.status === "A_FAIRE"); // J'applique une méthode filter() qui va vérifier le statut de chaque tâches
  // Je veux stocker les tâches terminées dans un nouveau tableau
  const finishedTasks = tasks.filter((task) => task.status === "TERMINE");
  return { toDoTasks, finishedTasks };
}
//Service pour scinder les toutes les tâches récupérées pour un user,  en deux tableaux distincts"à faire" et "Terminées"
async function getTasksByUserService(userId) {
  //Ne pas oublier de répercuter userId en paramètre
  const tasksByUser = await getTasksByUserModel(userId); //Ne pas oublier de répercuter userId en paramètre
  const toDoTasks = tasksByUser.filter(
    (taskByUser) => taskByUser.status === "A_FAIRE",
  );
  const finishedTasks = tasksByUser.filter(
    (taskByUser) => taskByUser.status === "TERMINE",
  );
  return { toDoTasks, finishedTasks }; // Je retourne mes tableaux
}

export {
  createTaskServices,
  updateTaskService,
  getAllTasksService,
  getTasksByUserService,
};
