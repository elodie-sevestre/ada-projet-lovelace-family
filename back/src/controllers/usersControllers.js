import getAllUsersService from "./usersServices.js";

function getAllUsersController(req, res) {
  const usersResult = getAllUsersService();
  res.json(usersResult);
}

export default getAllUsersController;
