import { Router } from 'express';
import requireAuth from '../middlewares/requireAuthentication.js';
import { ROLE } from '../constants.js';
import {
  createTaskController,
  updateTaskController,
  getAllTasksController,
  getTasksByUserController,
  deleteTaskController,
} from '../controllers/tasksControllers.js';
import createCheckRoleMiddleware from '../middlewares/checkRole.js';

//Aiguilleur, le router ici aiguille vers les bonnes routes: "Ecoute ce type de requêtes"
const tasksRoutes = Router();

// protège les routes tasksRoutes
tasksRoutes.use(requireAuth);

tasksRoutes.post(
  '/',
  createCheckRoleMiddleware(ROLE.Admin),
  createTaskController
);
tasksRoutes.get(
  '/',
  createCheckRoleMiddleware(ROLE.Admin),
  getAllTasksController
); // Ici la route pour aller consulter toutes les tâches (Vue Bernard)

//* Ici la route pour aller consulter les tâches pour un utilisateur (Vue Léa)
//! modification endpoint /users/:id par /users/:id_user
tasksRoutes.get(
  '/users/:id_user',
  createCheckRoleMiddleware(ROLE.Member),
  getTasksByUserController
);

// Modification tâche

tasksRoutes.put(
  '/:id',
  createCheckRoleMiddleware(ROLE.Admin),
  updateTaskController
);

// Suppression tâche

tasksRoutes.delete(
  '/:id',
  createCheckRoleMiddleware(ROLE.Admin),
  deleteTaskController
);

export default tasksRoutes;
