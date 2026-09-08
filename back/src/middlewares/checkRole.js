import AppError from '../utils/AppError.js';

function createCheckRoleMiddleware(roleWaited) {
  return (req, res, next) => {
    //le rôle provient du déchiffrement du JWT par le middleware require auth
    const roleUser = req.user.role;
    if (roleUser === roleWaited) {
      return next();
    }
    throw new AppError('Not found', 404);
  };
}

export default createCheckRoleMiddleware;

// function checkAdmin(req, res, next) {

//     const roleUser = ...;
//     if(roleUser === "Admin")
//         next();
// }

// function checkMembre(req, res, next) {

//     const roleUser = ...;
//     if(roleUser === "Membre")
//         next();
// }

// app.get("/test", createCheckAuthorizationMiddleware("Admin"), controller)
