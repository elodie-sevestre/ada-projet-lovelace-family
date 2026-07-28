import { Router } from "express";
import loginController from "../controllers/loginControllers.js";

const loginRoutes = Router();

//todo à redécouper

// POST /auth/inscription
loginRoutes.post("/inscription", loginController);

export default loginRoutes;
