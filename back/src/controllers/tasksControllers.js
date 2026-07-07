import { createTaskServices } from "../services/tasksServices.js";

async function createTaskController(req, res) {
  try {
    const { name, description, points } = req.body;
    //req contenu de l'utilisateur recupére et verifie les données entrées
    //trim permet de gérer le cas de si il y a que des espaces

    if (typeof name !== "string" || name.trim() === "") {
      throw new Error("Le nom de la tâche doit être un champ de caractère");
    }
    if (typeof points !== "number" || points < 1) {
      throw new Error(
        "La variable point est de type number et être strictement supérieur à zéro",
      );
    }
    const createTask = await createTaskServices(name, description, points);
    res.status(201).json(createTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export { createTaskController };
