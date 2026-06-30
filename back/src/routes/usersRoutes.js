import { Router } from "express";
// import getAllUsersController from "./usersControllers.js";

const usersRouter = Router();

// Route de test pour vérifier que le serveur répond
usersRouter.get("/", function (req, res) {
  res.send("Hello Ada!\n");
});

// usersRouter.get("/", getAllUsersController);

export default usersRouter;
