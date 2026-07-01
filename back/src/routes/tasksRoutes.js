import { Router } from "express";
import createTaskController from "../controllers/tasksControllers.js";

const tasksRoutes = Router();

tasksRoutes.post("/", createTaskController);

export default tasksRoutes;
