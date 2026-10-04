import {
  getAllUsersService,
  getUserByTokenService,
} from '../services/usersServices.js';

//Récupérer tous les utilisateurs
async function getAllUsersController(req, res) {
  const users = await getAllUsersService();
  res.status(200).json(users);
}

// renvoyer les information de l'utilisateur connecté via son token
async function getuserByToken(req, res) {
  const user = await getUserByTokenService(req.user);
  res.status(200).json(user);
}

export { getAllUsersController, getuserByToken };
