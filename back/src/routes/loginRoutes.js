import { Router } from 'express';
import requireAuth from '../middlewares/requireAuth.js';
import {
  createLoginController,
  connexionController,
} from '../controllers/loginControllers.js';

const loginRoutes = Router();

// POST /auth/inscription
loginRoutes.post('/inscription', createLoginController);

//POST /auth/connexion
loginRoutes.post('/connexion', connexionController);

export default loginRoutes;
