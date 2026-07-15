import {
  createTaskServices,
  updateTaskService,
  getAllTasksService,
  getTasksByUserService,
} from "../services/tasksServices.js";

async function createTaskController(req, res) {
  try {
    const { name, description, assignment, points } = req.body;
    //req contenu de l'utilisateur recupére et verifie les données entrées
    //trim permet de gérer le cas de si il y a que des espaces

    if (typeof name !== "string" || name.trim() === "") {
      throw new Error("Le nom de la tâche doit être un champ de caractère");
    }
    console.log(assignment);
    if (assignment === undefined || assignment === null || assignment === "") {
      throw new Error("Un membre doit être assigné à la tâche");
    }

    const assignedMember = Number(assignment);
    if (!Number.isInteger(assignedMember)) {
      throw new Error(
        "L'identifiant du membre assigné doit être un nombre entier",
      );
    }
    if (typeof points !== "number" || points < 1) {
      throw new Error(
        "La variable point est de type number et être strictement supérieur à zéro",
      );
    }
    const createTask = await createTaskServices(
      name,
      description,
      points,
      assignedMember,
    );
    res.status(201).json(createTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updateTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    // Vérifier que l'identifiant de la tâche est bien un nombre entier valide
    if (!id || !Number.isInteger(Number(id))) {
      return res
        .status(400)
        .json({ error: "L'identifiant de la tâche n'est pas valide !" });
    }
    const { name, description, status, points, user_id } = req.body;
    // Vérifier que le nom est bien renseigné et non vide
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Le nom de la tâche est requis !" });
    }
    // Vérifier que la description, si elle est fournie, est bien du texte
    if (description !== undefined && typeof description !== "string") {
      return res
        .status(400)
        .json({ error: "La description doit être du texte !" });
    }
    // Vérifier que le statut est bien renseigné
    if (!status) {
      return res.status(400).json({ error: "Le statut est requis !" });
    }
    // Vérifier que le statut fait partie des valeurs autorisées
    const validStatuses = ["A_FAIRE", "TERMINE"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: "La valeur du statut n'est pas valide !" });
    }
    // Vérifier que les points, si fournis, sont un nombre entier
    if (points !== undefined && !Number.isInteger(points)) {
      return res
        .status(400)
        .json({ error: "Les points doivent être un nombre entier !" });
    }
    // Vérifier que l'identifiant de l'utilisateur, si fourni, est un nombre entier
    if (user_id !== undefined && !Number.isInteger(user_id)) {
      return res
        .status(400)
        .json({ error: "L'identifiant de l'utilisateur n'est pas valide !" });
    }
    // Appeler le service pour mettre à jour la tâche
    const rows = await updateTaskService(id, {
      name,
      description,
      status,
      points,
      user_id,
    });
    // Renvoyer la tâche mise à jour.
    res.status(200).json(rows);
  } catch (error) {
    // Attraper toute erreur venant du service ou de la base de données
    res.status(500).json({ error: error.message });
  }
};

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
    const tasksByUser = await getTasksByUserService(id); //Ne pas oublier de passer l'id en paramètre
    res.status(200).json(tasksByUser);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la récupération des tâches de l'utilisateur",
    });
  }
}

export {
  createTaskController,
  updateTaskController,
  getAllTasksController,
  getTasksByUserController,
};
