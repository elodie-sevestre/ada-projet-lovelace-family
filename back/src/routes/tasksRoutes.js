import { Router } from "express";
import { getAllTasksController } from "../controllers/tasksControllers.js";

console.log("✅ tasksRoutes.js chargé");

//Aiguilleur, le router ici aiguille vers les bonnes routes: "Ecoute ce type de requêtes"
const tasksRoutes = Router();

tasksRoutes.get("/", getAllTasksController); // Ici la route pour aller consulter toutes les tâches (Vue Bernard)

export default tasksRoutes;
