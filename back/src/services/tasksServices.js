import {
  getAllTasksModel,
  getTasksByUserModel,
} from "../models/tasksModels.js";

async function getAllTasksService() {
  const tasks = await getAllTasksModel();
  console.log("Vérifier le contenu de task dans service");
  console.log(tasks);
  // Je veux stocker les tâhces à faire dans un nouveau tableau
  const toDoTasks = tasks.filter((task) => task.status === "à faire");
  console.log("Vérifier tâches à faire");
  console.log(toDoTasks);
  // Je veux stocker les tâches terminées dans un nouveau tableau
  const finishedTasks = tasks.filter((task) => task.status === "terminé");
  console.log("Vérifier tâches terminées");
  console.log(finishedTasks);
  return { toDoTasks, finishedTasks };
}

async function getTasksByUserService() {
  const tasksByUser = await getTasksByUserModel();
  const toDoTasks = tasksByUser.filter(
    (tasksByUser) => taskByUser.status === "à faire",
  );
  const finishedTasks = tasksByUser.filter(
    (taskByUser) => taskByUser.status === "terminé",
  );
  return { toDoTasks, finishedTasks };
}

export { getAllTasksService, getTasksByUserService };
