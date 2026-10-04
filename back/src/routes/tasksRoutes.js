import { Router } from 'express';
import requireAuth from '../middlewares/requireAuthentication.js';
import { ROLE } from '../constants.js';
import {
  createTaskController,
  updateTaskController,
  updateTaskStatusController, // NOUVEAU : contrôleur du changement de statut
  // getAllTasksController,
  getTasksByUserIdController,
  getTasksByUserController,
  deleteTaskController,
} from '../controllers/tasksControllers.js';
import createCheckRoleMiddleware from '../middlewares/checkRole.js';

//Aiguilleur, le router ici aiguille vers les bonnes routes: "Ecoute ce type de requêtes"
const tasksRoutes = Router();

// protège les routes tasksRoutes
tasksRoutes.use(requireAuth);

//* Ici la route pour consulter les tâches d'un utilisateur en particulier (permet de filtrer)
tasksRoutes.get(
  '/users/:id',
  createCheckRoleMiddleware(ROLE.Admin),
  getTasksByUserIdController
);

//* Ici la route pour aller consulter les tâches de l'utilisateur connecté
tasksRoutes.get(
  '/users',
  createCheckRoleMiddleware(ROLE.Member),
  getTasksByUserController
);

// Modification tâche

tasksRoutes.put(
  '/:id',
  createCheckRoleMiddleware(ROLE.Admin),
  updateTaskController
);

// NOUVEAU : changement de statut (cocher / décocher une tâche), PATCH car modification partielle.
// Pas de checkRole ici : la route est ouverte à tout utilisateur connecté (requireAuth).
// La règle "ADMIN OU membre assigné à cette tâche" est appliquée dans le service.

tasksRoutes.patch('/:id/status', updateTaskStatusController);

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

//Route plus utilisé consulter toutes les tâches et géré selon le rôle
// // Ici la route pour aller consulter toutes les tâches
// tasksRoutes.get(
//   '/',
//   createCheckRoleMiddleware(ROLE.Admin),
//   getAllTasksController
// );

export default tasksRoutes;
