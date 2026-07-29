import {
  createLoginService,
  connexionService,
} from "../services/loginServices.js";

const loginController = async (req, res) => {
  try {
    const { role, name, mail, tribe_name, password_hash } = req.body;

    // On enregistre l'utilisateur avec le HASH (colonne password_hash)
    const createLogin = await createLoginService(
      role,
      name,
      mail,
      tribe_name,
      password_hash,
    );

    // On ne renvoie jamais le hash au client
    res.status(201).json(createLogin);
  } catch (error) {
    // console.error(error);
    res.status(401).json({ error: error.message });
  }
};

const connexionController = async (req, res) => {
  const { mail, password } = req.body;
  if (!mail || !password) {
    return res.status(400).json({ erreur: "Email et mot de passe requis" });
  }

  try {
    const token = await connexionService(mail, password);

    if (!token) {
      return res.status(401).json({ erreur: "Identifiants invalides" });
    }

    return res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erreur: "Erreur serveur" });
  }
};

export { loginController, connexionController };
