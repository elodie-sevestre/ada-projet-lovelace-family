import getAllUsersService from '../services/usersServices.js';

async function getAllUsersController(req, res) {
  const users = await getAllUsersService();
  res.status(200).json(users);
}
export default getAllUsersController;
