// Controller : gère la requête HTTP (req/res). Extrait les données de req, appelle le service, renvoie la réponse. Ne contient pas de logique métier ni de SQL.

import {
  updateTaskDetailsService,
  updateTaskUserAssignedService,
} from "../services/tasksServices.js";

const updateTaskDetailsController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, points } = req.body;
    const updateTaskDetails = await updateTaskDetailsService(id, {
      name,
      description,
      status,
      points,
    });
    if (!updateTaskDetails) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(updateTaskDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTaskUserAssignedController = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const updateTaskUserAssigned = await updateTaskUserAssignedService(id, {
      user_id,
    });
    if (!updateTaskUserAssigned) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(updateTaskUserAssigned);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { updateTaskDetailsController, updateTaskUserAssignedController };
