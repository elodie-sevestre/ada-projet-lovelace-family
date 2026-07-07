// Route : définit l'URL et la méthode HTTP, appelle le controller. Rien d'autre.

import { Router } from "express";
import {
  updateTaskDetailsController,
  updateTaskUserAssignedController,
} from "../controllers/tasksControllers.js";

const tasksRoutes = Router();

// Modification tâche : deux types de modifs
// modif des champs : name, description, status, points
// modif de l'assignation
// Methode HTTP : utilisation de PATCH car modif partielle
// modif via l'id

tasksRoutes.patch("/:id", updateTaskDetailsController);
tasksRoutes.patch("/:id/assigned-user", updateTaskUserAssignedController);

export default tasksRoutes;
