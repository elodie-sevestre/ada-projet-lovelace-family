import { getAllTasksModel } from "../models/tasksModels.js";

async function getAllTasksService() {
  const tasks = await getAllTasksModel();
  // Je veux stocker les tâhces à faire dans un nouveau tableau
  const todoTasks = tasks.filter((tasks) => task.status === "A_FAIRE");
  // Je veux stocker les tâches terminées dans un nouveau tableau
  const finishedTasks = tasks.filter((tasks) => task.status === "TERMINES");
  return { todoTasks, finishedTasks };
}

export { getAllTasksService };
