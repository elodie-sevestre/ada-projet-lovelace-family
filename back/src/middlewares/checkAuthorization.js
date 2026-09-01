function createCheckAuthorizationMiddleware(roleWaited) {
  return (req, res, next) => {
    //le rôle provient du déchiffrement du JWT par le middleware require auth
    const roleUser = req.user.role;
    if (roleUser === roleWaited) next();
    else return res.status(404).json({ erreur: 'Not found' });
  };
}

export default createCheckAuthorizationMiddleware;

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
