import { Router } from "express";
import { getAllTasksController } from "./src/controllers/tasksControllers.js";

const usersRouter = Router();

tasksRouter.get("/", getAllTasksController);

export default tasksRouter;
