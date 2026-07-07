// Route : définit l'URL et la méthode HTTP, appelle le controller. Rien d'autre.

import { Router } from "express";
import {
  updateTaskDetailsController,
  updateTaskStatusController,
  updateTaskUserAssignedController,
} from "../controllers/tasksControllers.js";

const tasksRoutes = Router();

// Modification tâche : trois types de modifs
// modif des champs : name, description et points
// modif du statut
// modif de l'assignation
// Methode HTTP : utilisation de PATCH car modif partielle
// modif via l'id

tasksRoutes.patch("/:id", updateTaskDetailsController);
tasksRoutes.patch("/:id/status", updateTaskStatusController);
tasksRoutes.patch("/:id/assigned-user", updateTaskUserAssignedController);

export default tasksRoutes;
