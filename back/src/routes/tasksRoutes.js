import { Router } from "express";
import {
  createTaskController,
  updateTaskController,
  getAllTasksController,
  getTasksByUserController,
} from "../controllers/tasksControllers.js";

const tasksRoutes = Router();
//Aiguilleur, le router ici aiguille vers les bonnes routes: "Ecoute ce type de requêtes"

tasksRoutes.post("/", createTaskController);
tasksRoutes.get("/", getAllTasksController); // Ici la route pour aller consulter toutes les tâches (Vue Bernard)
tasksRoutes.get("/users/:id", getTasksByUserController); // Ici la route pour aller consulter les tâches pour un utilisateur (Vue Léa)

// Modification tâche :
// Methode HTTP : utilisation de PUT

tasksRoutes.put("/:id", updateTaskController);

export default tasksRoutes;
