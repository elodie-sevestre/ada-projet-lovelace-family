// Controller : gère la requête HTTP (req/res). Extrait les données de req, appelle le service, renvoie la réponse. Ne contient pas de logique métier ni de SQL.

import {
  updateTaskDetailsService,
  updateTaskStatusService,
  updateTaskUserAssignedService,
} from "../services/tasksServices.js";

const updateTaskDetailsController = (req, res) => {
  updateTaskDetailsService(req);
};
const updateTaskUserAssignedController = (req, res) => {
  updateTaskUserAssignedService(req);
};
const updateTaskStatusController = (req, res) => {
  updateTaskStatusService(req);
};

export {
  updateTaskDetailsController,
  updateTaskStatusController,
  updateTaskUserAssignedController,
};
