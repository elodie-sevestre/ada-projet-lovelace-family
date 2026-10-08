import { get } from "./client.js";
const USERS_ROUTE = "/api/users";
const USERS_INFO_ROUTE = "/api/users/currentUser";

export function getUsers() {
  return get(USERS_ROUTE);
}

export function getCurrentUserInfo() {
  return get(USERS_INFO_ROUTE);
}
