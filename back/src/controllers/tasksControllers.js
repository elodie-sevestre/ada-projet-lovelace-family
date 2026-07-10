import {
  createTaskServices,
  updateTaskService,
} from "../services/tasksServices.js";

async function createTaskController(req, res) {
  const rows = await createTaskServices(req);
  console.log("rows");
  console.log(rows);
  res.status(201).json(rows);
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

export { createTaskController, updateTaskController };

// Controller : gère la requête HTTP (req/res). Extrait les données de req, appelle le service, renvoie la réponse. Ne contient pas de logique métier ni de SQL.
