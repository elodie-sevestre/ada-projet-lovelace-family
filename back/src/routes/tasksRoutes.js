import { Router } from "express";
import {
  createTaskController,
  updateTaskDetailsController,
  updateTaskUserAssignedController,
} from "../controllers/tasksControllers.js";

const tasksRoutes = Router();

tasksRoutes.post("/", createTaskController);

// Modification tâche : deux types de modifs
// modif des champs : name, description, status, points
// modif de l'assignation
// Methode HTTP : utilisation de PATCH car modif partielle
// modif via l'id

tasksRoutes.patch("/:id", updateTaskDetailsController);
tasksRoutes.patch("/:id/assigned-user", updateTaskUserAssignedController);

export default tasksRoutes;

// Route : définit l'URL et la méthode HTTP, appelle le controller. Rien d'autre.
