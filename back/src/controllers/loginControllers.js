import {
  createLoginService,
  connexionService,
} from '../services/loginServices.js';
import AppError from '../utils/AppError.js';

//  expression régulière pour contrôler le format de l'email qui doit contenir le @ et le .
const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/;

async function createLoginController(req, res) {
  const { role, name, mail, tribe_name, password } = req.body;

  if (!name || !mail || !password) {
    throw new AppError('Champs requis manquants', 400);
  }

  await createLoginService(role, name, mail, tribe_name, password);

  // On ne renvoie jamais le hash au client
  res.status(204).send();
}

async function connexionController(req, res) {
  const { mail, password } = req.body;
  if (!mail || !password) {
    throw new AppError('Email et mot de passe requis', 400);
  }

  if (!EMAIL_REGEX.test(mail)) {
    throw new AppError('Format Email invalide', 400);
  }

  if (password.length < 8) {
    throw new AppError('Format password invalide', 400);
  }

  const token = await connexionService(mail, password);

  if (!token) {
    throw new AppError('Identifiants invalides', 401);
  }

  return res.json({ token });
}

export { createLoginController, connexionController };
