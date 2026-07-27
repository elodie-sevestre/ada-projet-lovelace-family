import { get } from "./client.js";
const USERS_ROUTE = "/users";

export function getUsers() {
  return get(USERS_ROUTE);
}
