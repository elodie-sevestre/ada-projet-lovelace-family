import { get, post, put, del } from "./client.js";
const TASKS_ROUTE = "/api/tasks";
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

export function deleteTask(id) {
  const taskUrl = TASKS_ROUTE + "/" + String(id);
  return del(taskUrl);
}
