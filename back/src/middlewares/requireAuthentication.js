import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';
import AppError from '../utils/AppError.js';

// Middleware : à placer devant les routes à protéger
function requireAuth(req, res, next) {
  // 1. Récupérer l'en-tête "Authorization: Bearer <token>"
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Token manquant', 401);
  }

  // 2. Isoler le token (on enlève les 7 caractères de "Bearer ")
  const token = header.slice(7);

  // 3. Vérifier la signature avec le secret
  let payload;
  try {
    payload = jwt.verify(token, config.jwt_secret);
  } catch {
    throw new AppError('Token invalide ou expiré', 401);
  }
  req.user = payload; // { userId, role } dispo dans les routes suivantes
  next(); // ✅ badge valide → on continue
}

export default requireAuth;
