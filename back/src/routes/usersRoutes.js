import { Router } from 'express';
import requireAuth from '../middlewares/requireAuthentication.js';
import {
  getAllUsersController,
  getuserByToken,
} from '../controllers/usersControllers.js';

const usersRoutes = Router();

// Route de test pour vérifier que le serveur répond
// usersRoutes.get("/", function (req, res) {
//   res.send("Hello Ada!\n");
// });

// protection des routes usersRoutes
usersRoutes.use(requireAuth);

usersRoutes.get('/', getAllUsersController);
usersRoutes.get('/currentUser', getuserByToken);

export default usersRoutes;
