import {
  getAllTasksService,
  getTasksByUserService,
} from "../services/tasksServices.js";

//Le controller contrôle les requête et les réponses: (Bon format? Est-ce que j'ai les bonnes infos, au bon format pour ma BDD)
async function getAllTasksController(req, res) {
  try {
    const tasks = await getAllTasksService();
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des tâches" });
  }
}

async function getTasksByUserController(req, res) {
  const { id } = req.params;
  //Validation : Vérifier que mon id est bien un nombre: Question de sécurité ?
  // if(id is not a number) {return error 400 blabliblou}
  try {
    const tasksByUser = await getTasksByUserService(id); //Ne pas oulbier de passer l'id en paramètre
    res.status(200).json(tasksByUser);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des tâches de l'utilisateur",
    });
  }
}

export { getAllTasksController, getTasksByUserController };
