import {
  createTaskServices,
  updateTaskService,
} from "../services/tasksServices.js";

// VOIR AVEC LES FILLES POUR CENTRALISER TRY/CATCH

async function createTaskController(req, res) {
  const rows = await createTaskServices(req);
  console.log("rows");
  console.log(rows);
  res.status(201).json(rows);
}

const updateTaskController = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, status, points, user_id } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    // ajouter les contrôles pour name, description, points et user_id
    //! vérifier que points est bien un nb (int)
    const updateTask = await updateTaskService(id, {
      name,
      description,
      status,
      points,
      user_id,
    });
    // cette erreur va être gérée par la requête dans model
    // if (!updateTask) {
    //   return res.status(404).json({ error: "Task not found" });
    // }
    res.status(200).json(updateTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const updateTaskUserAssignedController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { user_id } = req.body;
//     const updateTaskUserAssigned = await updateTaskUserAssignedService(id, {
//       user_id,
//     });
//     if (!updateTaskUserAssigned) {
//       return res.status(404).json({ error: "Task not found" });
//     }
//     res.status(200).json(updateTaskUserAssigned);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export { createTaskController, updateTaskController };

// Controller : gère la requête HTTP (req/res). Extrait les données de req, appelle le service, renvoie la réponse. Ne contient pas de logique métier ni de SQL.
