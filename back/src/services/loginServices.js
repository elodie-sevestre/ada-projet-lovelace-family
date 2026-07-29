import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";
import { createLoginModel, findUserByEmail } from "../models/loginModels.js";

const createLoginService = async (
  role,
  name,
  mail,
  tribe_name,
  password_hash,
) => {
  // 1. On transforme le mot de passe en hash irréversible
  const hash = await bcrypt.hash(password_hash, 10); // 10 = "coût" du calcul

  await createLoginModel(role, name, mail, tribe_name, hash);
};

const connexionService = async (mail, password) => {
  // 1. On retrouve l'utilisateur par son email
  const user = await findUserByEmail(mail);
  if (!user) {
    // On ne précise pas si c'est l'email ou le mdp qui est faux (sécurité)
    return null;
  }

  // 2. On compare le mot de passe fourni au hash stocké
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return null;
  }

  // 3. On fabrique le token : id + rôle, JAMAIS d'infos sensibles !
  const token = jwt.sign(
    { userId: user.id, role: user.role }, //payload : contenu du token
    config.jwt_secret, // à ajouter dans config/env.js et .env
    { expiresIn: "24h" },
  );

  return token;
};

export { createLoginService, connexionService };
