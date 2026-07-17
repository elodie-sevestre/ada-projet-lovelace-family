import getAllUsersService from "../services/usersServices.js";

async function getAllUsersController(req, res) {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des users" });
  }
}
export default getAllUsersController;
