import createLoginService from "../services/loginServices.js";

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

// ↑ adaptez à VOTRE base : Mongoose, Sequelize, un tableau, etc.

export default loginController;
