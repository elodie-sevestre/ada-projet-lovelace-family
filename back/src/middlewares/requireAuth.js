import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";

// Middleware : à placer devant les routes à protéger
function requireAuth(req, res, next) {
  // 1. Récupérer l'en-tête "Authorization: Bearer <token>"
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ erreur: "Token manquant" });
  }

  // 2. Isoler le token (on enlève les 7 caractères de "Bearer ")
  const token = header.slice(7);

  // 3. Vérifier la signature avec le secret
  try {
    const payload = jwt.verify(token, config.jwt_secret);
    req.user = payload; // { userId, role } dispo dans les routes suivantes
    next(); // ✅ badge valide → on continue
  } catch (err) {
    return res.status(401).json({ erreur: "Token invalide ou expiré" }); // ❌
  }
}

export default requireAuth;
