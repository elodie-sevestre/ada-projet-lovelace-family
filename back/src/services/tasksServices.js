import { getAllTasksModel } from "../models/tasksModels.js";

async function getAllTasksService() {
  const tasks = await getAllTasksModel();
  return tasks;
}

export { getAllTasksService };
