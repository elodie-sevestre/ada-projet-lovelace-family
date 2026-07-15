import { get, post } from "./client.js";
const TASKS_ROUTE = "/tasks";

export function getTasks() {
  return get(TASKS_ROUTE);
}

export function createTask(taskData) {
  return post(TASKS_ROUTE, taskData);
}
