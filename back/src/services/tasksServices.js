import {
  createTaskModel,
  updateTaskDetailsModel,
  getAllTasksModel,
  getTasksByUserModel,
  deleteTaskModel,
  updateTaskStatusModel, // NOUVEAU : modèle qui change le statut d'une tâche
} from '../models/tasksModels.js';
import {
  updateTaskAssignedUserModel,
  createTaskAssignedUserModel,
  isTaskAssignedToUserModel, // NOUVEAU : modèle qui vérifie qu'une tâche est assignée à un user
} from '../models/usersTasksModel.js';
import AppError from '../utils/AppError.js';
import { TASK_STATUS } from '../constants.js';
import { ROLE } from '../constants.js';

async function createTaskServices(name, description, points, assignedMember) {
  // 1. Créer la tâche elle-même
  const createdTask = await createTaskModel(name, description, points);

  // 2. Lier la tâche créée au membre assigné dans la table pivot users_tasks.
  // On a besoin de l'id généré par la première insertion (createdTask.id).
  await createTaskAssignedUserModel(createdTask.id, assignedMember);

  // 3. Renvoyer la tâche avec l'info du membre assigné, utile pour le frontend
  return { ...createdTask, assignedMember };
}

const updateTaskService = async (task_id, task_details) => {
  // Mettre à jour les détails de la tâche
  const resultTaskDetails = await updateTaskDetailsModel(task_id, task_details);
  // Bloquer la suite si la tâche n'existe pas, pour ne pas assigner un utilisateur à une tâche inexistante
  if (!resultTaskDetails) {
    throw new AppError(`La tâche ${task_id} n'existe pas`, 404);
  }
  // Mettre à jour l'utilisateur assigné à la tâche
  if (task_details.user_id !== undefined) {
    await updateTaskAssignedUserModel(task_id, task_details);
  }
  // Renvoyer les détails de la tâche mise à jour
  return resultTaskDetails;
};

// NOUVEAU : service pour changer uniquement le statut d'une tâche.
// Règle métier : l'ADMIN peut le faire sur n'importe quelle tâche,
// un MEMBRE ne peut le faire que sur une tâche qui lui est assignée.
// Le service décide (règle métier), le modèle exécute le SQL.

async function updateTaskStatusService(taskId, status, user) {
  // Si l'utilisateur n'est pas admin, on vérifie qu'il est bien assigné à cette tâche
  if (user.role !== ROLE.Admin) {
    const isAssigned = await isTaskAssignedToUserModel(taskId, user.userId);
    // 404 plutôt que 403 : on ne révèle pas l'existence d'une tâche qui n'est pas la sienne
    if (!isAssigned) {
      throw new AppError('Tâche introuvable', 404);
    }
  }
  // Mettre à jour le statut en base

  const task = await updateTaskStatusModel(taskId, status);
  // Le modèle renvoie undefined si aucune ligne n'a été modifiée : la tâche n'existe pas

  if (!task) {
    throw new AppError(`La tâche ${taskId} n'existe pas`, 404);
  }
  return task;
}

//déjà fait en bas
// //Service pour scinder les toutes les tâches récupérées en deux tableaux distincts"à faire" et "Terminées"
// async function getAllTasksService() {
//   const tasks = await getAllTasksModel();
//   // Je veux stocker les tâches à faire dans un nouveau tableau
//   const toDoTasks = tasks.filter((task) => task.status === TASK_STATUS.TODO); // J'applique une méthode filter() qui va vérifier le statut de chaque tâches
//   // Je veux stocker les tâches terminées dans un nouveau tableau
//   const finishedTasks = tasks.filter(
//     (task) => task.status === TASK_STATUS.DONE
//   );
//   return { toDoTasks, finishedTasks };
// }

//Service pour scinder les toutes les tâches récupérées pour un user,  en deux tableaux distincts"à faire" et "Terminées"
async function getTasksByUserService(userId, userRole) {
  //Ne pas oublier de répercuter userId en paramètre
  let tasksByUser;
  if (userRole === ROLE.Admin) {
    tasksByUser = await getAllTasksModel();
  } else {
    tasksByUser = await getTasksByUserModel(userId); //Ne pas oublier de répercuter userId en paramètre
  }
  const toDoTasks = tasksByUser.filter(
    (taskByUser) => taskByUser.status === TASK_STATUS.TODO
  );
  const finishedTasks = tasksByUser.filter(
    (taskByUser) => taskByUser.status === TASK_STATUS.DONE
  );
  return { toDoTasks, finishedTasks }; // Je retourne mes tableaux
}

const deleteTaskService = async (task_id) => {
  const rows = await deleteTaskModel(task_id);
  if (!rows) {
    return false;
  }
  return true;
};

export {
  createTaskServices,
  updateTaskService,
  updateTaskStatusService, // NOUVEAU
  // getAllTasksService,
  getTasksByUserService,
  deleteTaskService,
};
