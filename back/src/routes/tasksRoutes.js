import { Router } from "express";
import {
  updateTaskDetailsController,
  updateTaskStatusController,
  updateTaskUserAssignedController,
} from "../controllers/tasksControllers.js";

// ici on applique la méthode .Router() à express
// on aurait pu mettre const xxx = Router() si Router avait été explicitement importer au départ

const tasksRoutes = Router();

// Modification tâche : trois types de modifs
// modif des champs : name, description et points
// modif du statut
// modif de l'assignation
// Methode HTTP : utilisation de PATCH car modif partielle
// modif via l'id

tasksRoutes.put("/:id", updateTaskDetailsController);
tasksRoutes.put("/:id/status", updateTaskStatusController);
tasksRoutes.put("/:id/assigned-user", updateTaskUserAssignedController);

export default tasksRoutes;
