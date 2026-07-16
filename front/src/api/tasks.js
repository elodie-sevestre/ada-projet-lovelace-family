import { get, post, put } from "./client.js";
const TASKS_ROUTE = "/tasks";
// const ROUTE_TASKS_BY_ID = (id) => `/tasks/${id}`;

export function getTasks() {
  return get(TASKS_ROUTE);
}

export function createTask(taskData) {
  return post(TASKS_ROUTE, taskData);
}

export function editTask(id, updatedTask) {
  const taskUrl = TASKS_ROUTE + "/" + String(id);
  return put(taskUrl, updatedTask);
}
