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
