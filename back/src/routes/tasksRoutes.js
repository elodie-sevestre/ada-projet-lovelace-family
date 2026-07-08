import { Router } from "express";
import {
  createTaskController,
  updateTaskController,
} from "../controllers/tasksControllers.js";

const tasksRoutes = Router();

tasksRoutes.post("/", createTaskController);

// Modification tâche :
// Methode HTTP : utilisation de PUT
// modif via l'id

tasksRoutes.put("/:id", updateTaskController);

export default tasksRoutes;

// Route : définit l'URL et la méthode HTTP, appelle le controller. Rien d'autre.
