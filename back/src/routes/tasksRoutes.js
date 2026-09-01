import { Router } from 'express';
import requireAuth from '../middlewares/requireAuth.js';
import { ROLE } from '../constants.js';
import {
  createTaskController,
  updateTaskController,
  getAllTasksController,
  getTasksByUserController,
  deleteTaskController,
} from '../controllers/tasksControllers.js';
import createCheckAuthorizationMiddleware from '../middlewares/checkAuthorization.js';

//Aiguilleur, le router ici aiguille vers les bonnes routes: "Ecoute ce type de requêtes"
const tasksRoutes = Router();

// protège les routes tasksRoutes
tasksRoutes.use(requireAuth);

tasksRoutes.post(
  '/',
  createCheckAuthorizationMiddleware(ROLE.Admin),
  createTaskController
);
tasksRoutes.get(
  '/',
  createCheckAuthorizationMiddleware(ROLE.Admin),
  getAllTasksController
); // Ici la route pour aller consulter toutes les tâches (Vue Bernard)
tasksRoutes.get('/users/:id', getTasksByUserController); // Ici la route pour aller consulter les tâches pour un utilisateur (Vue Léa)

// Modification tâche

tasksRoutes.put(
  '/:id',
  createCheckAuthorizationMiddleware(ROLE.Admin),
  updateTaskController
);

// Suppression tâche

tasksRoutes.delete(
  '/:id',
  createCheckAuthorizationMiddleware(ROLE.Admin),
  deleteTaskController
);

export default tasksRoutes;
