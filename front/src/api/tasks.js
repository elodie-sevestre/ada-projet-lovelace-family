import { get, post, put, patch, del } from "./client.js"; // NOUVEAU : import de patch
const TASKS_ROUTE = "/api/tasks";
const TASKS_ROUTE_USERS = "/api/tasks/users";
// const ROUTE_TASKS_BY_ID = (id) => `/tasks/${id}`;

export function getTasks() {
  return get(TASKS_ROUTE_USERS);
}

export function createTask(taskData) {
  return post(TASKS_ROUTE, taskData);
}

export function editTask(id, updatedTask) {
  const taskUrl = TASKS_ROUTE + "/" + String(id);
  return put(taskUrl, updatedTask);
}

// NOUVEAU : change uniquement le statut (cocher / décocher), accessible au membre assigné.
// status vaut "A_FAIRE" ou "TERMINE" (cf. TASK_STATUS dans constants.js).
// Appelle PATCH /api/tasks/:id/status, et non le PUT réservé à l'admin.
export function updateTaskStatus(id, status) {
  const taskUrl = TASKS_ROUTE + "/" + String(id) + "/status";
  return patch(taskUrl, { status });
}

export function deleteTask(id) {
  const taskUrl = TASKS_ROUTE + "/" + String(id);
  return del(taskUrl);
}
