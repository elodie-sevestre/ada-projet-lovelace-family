import { Router } from 'express';
import requireAuth from '../middlewares/requireAuthentication.js';
import { ROLE } from '../constants.js';
import {
  createTaskController,
  updateTaskController,
  getAllTasksController,
  getTasksByUserIdController,
  getTasksByUserController,
  deleteTaskController,
} from '../controllers/tasksControllers.js';
import createCheckRoleMiddleware from '../middlewares/checkRole.js';

//Aiguilleur, le router ici aiguille vers les bonnes routes: "Ecoute ce type de requêtes"
const tasksRoutes = Router();

// protège les routes tasksRoutes
tasksRoutes.use(requireAuth);

//* Ici la route pour consulter les tâches d'un utilisateur
tasksRoutes.get(
  '/users/:id',
  createCheckRoleMiddleware(ROLE.Admin),
  getTasksByUserIdController
);

//* Ici la route pour aller consulter les tâches de l'utilisateur connecté
tasksRoutes.get(
  '/users',
  // createCheckRoleMiddleware(ROLE.Member),
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

tasksRoutes.post(
  '/',
  createCheckRoleMiddleware(ROLE.Admin),
  createTaskController
);

// Ici la route pour aller consulter toutes les tâches
tasksRoutes.get(
  '/',
  createCheckRoleMiddleware(ROLE.Admin),
  getAllTasksController
);

export default tasksRoutes;
