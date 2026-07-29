import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import {
  loginController,
  connexionController,
} from "../controllers/loginControllers.js";

const loginRoutes = Router();

// POST /auth/inscription
loginRoutes.post("/inscription", loginController);

//POST /auth/connexion
loginRoutes.post("/connexion", connexionController);

export default loginRoutes;
