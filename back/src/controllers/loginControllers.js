import {
  createLoginService,
  connexionService,
} from '../services/loginServices.js';

const createLoginController = async (req, res) => {
  try {
    const { role, name, mail, tribe_name, password } = req.body;

    if (!name || !mail || !password) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    await createLoginService(role, name, mail, tribe_name, password);

    // On ne renvoie jamais le hash au client
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Inscription impossible' });
  }
};

const connexionController = async (req, res) => {
  const { mail, password } = req.body;
  if (!mail || !password) {
    return res.status(400).json({ erreur: 'Email et mot de passe requis' });
  }

  try {
    const token = await connexionService(mail, password);

    if (!token) {
      return res.status(401).json({ erreur: 'Identifiants invalides' });
    }

    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erreur: 'Erreur serveur' });
  }
};

export { createLoginController, connexionController };
