// Middleware de gestion d'erreurs

// Express 5 transmet automatiquement les promesses rejetées des handlers async à ce middleware (pas besoin de try/catch dans chaque route)
// middleware d'erreur prend toujours 4 params (err, req, res, next)
// err : l'objet erreur transmis
// req/res : requête et réponse HTTP
// next : fct pour passer la main au maillon suivant
// next obligatoire même s'il n'est pas utilisé

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  // log côté serveur ds terminal
  const isServerError = statusCode >= 500;
  const message = isServerError ? 'Erreur serveur' : err.message;
  if (isServerError) {
    console.error(err);
  }
  res.status(statusCode).json({ error: message });
}

export default errorHandler;
