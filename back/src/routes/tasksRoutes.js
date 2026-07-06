import { Router } from "express";
import { getAllTasksController } from "../controllers/tasksControllers.js";

//Aiguilleur, le router ici aiguille vers les bonnes routes:
const tasksRoutes = Router();

tasksRoutes.get("/", getAllTasksController); // Ici la routepour aller consulter toutes les tâches (Vue Bernard)

export default tasksRoutes;
