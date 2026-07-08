import {
  getAllTasksModel,
  getTasksByUserModel,
} from "../models/tasksModels.js";

//Service pour scinder les toutes les tâches récupérées en deux tableaux distincts"à faire" et "Terminées"
async function getAllTasksService() {
  const tasks = await getAllTasksModel();
  console.log("Vérifier le contenu de task dans service");
  console.log(tasks);
  // Je veux stocker les tâches à faire dans un nouveau tableau
  const toDoTasks = tasks.filter((task) => task.status === "à faire"); // J'applique une méthode filter() qui va vérifier le statut de chaque tâches
  // Je veux stocker les tâches terminées dans un nouveau tableau
  const finishedTasks = tasks.filter((task) => task.status === "terminé");
  return { toDoTasks, finishedTasks };
}
//Service pour scinder les toutes les tâches récupérées pour un user,  en deux tableaux distincts"à faire" et "Terminées"
async function getTasksByUserService(userId) {
  //Ne pas oublier de répercuter userId en paramètre
  const tasksByUser = await getTasksByUserModel(userId); //Ne pas oublier de répercuter userId en paramètre
  const toDoTasks = tasksByUser.filter(
    (taskByUser) => taskByUser.status === "à faire",
  );
  const finishedTasks = tasksByUser.filter(
    (taskByUser) => taskByUser.status === "terminé",
  );
  return { toDoTasks, finishedTasks }; // Je retourne mes tableaux
}

export { getAllTasksService, getTasksByUserService };
