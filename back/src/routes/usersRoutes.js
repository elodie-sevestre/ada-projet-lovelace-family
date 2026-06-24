import { Router } from "express";
import getAllUsersController from "./usersControllers.js";

const usersRouter = Router();

usersRouter.get("/", getAllUsersController);

export default usersRouter;
