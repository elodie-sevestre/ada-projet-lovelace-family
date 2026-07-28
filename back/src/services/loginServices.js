import bcrypt from "bcryptjs";
import createLoginModel from "../models/loginModels.js";

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

export default createLoginService;
