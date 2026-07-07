import { getAllTasksService } from "../services/tasksServices.js";

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

export { getAllTasksController };
