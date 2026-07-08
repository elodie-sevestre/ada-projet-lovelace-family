import { getAllTasksModel } from "../models/tasksModels.js";

async function getAllTasksService() {
  const tasks = await getAllTasksModel();
  // Je veux stocker les tâhces à faire dans un nouveau tableau
  const toDoTasks = tasks.filter((tasks) => task.status === "A_FAIRE");
  // Je veux stocker les tâches terminées dans un nouveau tableau
  const finishedTasks = tasks.filter((tasks) => task.status === "TERMINES");
  return { toDoTasks, finishedTasks };
}

async function getTasksByUserService() {
  const tasksByUser = await getTasksByUserModel();
  const toDoTasks = tasksByUser.filter(
    (tasksByUser) => tasksByUser.status === "A_FAIRE",
  );
  const finishedTasks = tasksByUser.filter(
    (tasksByUser) => tasksByUser.status === "TERMINES",
  );
  return { toDoTasks, finishedTasks };
}

export { getAllTasksService, getTasksByUserService };
