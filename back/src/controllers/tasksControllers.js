import {
  createTaskServices,
  updateTaskService,
  getAllTasksService,
  getTasksByUserService,
  deleteTaskService,
} from '../services/tasksServices.js';
import AppError from '../utils/AppError.js';
import { TASK_STATUS } from '../constants.js';

async function createTaskController(req, res) {
  const { name, description, assignment, points } = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    throw new AppError(
      'Le nom de la tâche doit être un champ de caractère',
      400
    );
  }

  const trimmedName = name.trim();

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== 'string'
  ) {
    throw new AppError('La description doit être du texte !', 400);
  }

  if (assignment === undefined || assignment === null || assignment === '') {
    throw new AppError('Un membre doit être assigné à la tâche', 400);
  }

  const assignedMember = Number(assignment);
  if (!Number.isInteger(assignedMember)) {
    throw new AppError(
      "L'identifiant du membre assigné doit être un nombre entier",
      400
    );
  }
  if (!Number.isInteger(points) || points < 1) {
    throw new AppError(
      'Les points doivent être un nombre entier supérieur ou égal à 1',
      400
    );
  }
  const createTask = await createTaskServices(
    trimmedName,
    description,
    points,
    assignedMember
  );
  res.status(201).json(createTask);
}

async function updateTaskController(req, res) {
  const { id } = req.params;
  const { name, description, status, points, user_id } = req.body;

  // Vérifier que l'identifiant de la tâche est bien un nombre entier valide
  if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
    throw new AppError("L'identifiant de la tâche n'est pas valide !", 400);
  }

  // Vérifier que le champ NAME est bien renseignée avec une string et qu'il n'est pas vide
  if (typeof name !== 'string' || name.trim() === '') {
    throw new AppError('Le nom de la tâche est requis ou mal renseigné!', 400);
  }

  const trimmedName = name.trim();

  // Vérifier que la description, si elle est fournie, est bien du texte
  if (
    description !== undefined &&
    description !== null &&
    typeof description !== 'string'
  ) {
    throw new AppError('La description doit être du texte !', 400);
  }

  // Vérifier que le statut est bien renseigné
  if (!status) {
    throw new AppError('Le statut est requis !', 400);
  }

  // Vérifier que la valeur du statut est autorisée
  if (!Object.values(TASK_STATUS).includes(status)) {
    throw new AppError("La valeur du statut n'est pas autorisée !", 400);
  }

  // Vérifier que les points, si fournis, sont un nombre entier
  if (points !== undefined && (!Number.isInteger(points) || points < 1)) {
    throw new AppError(
      'Les points doivent être un nombre entier supérieur ou égal à 1',
      400
    );
  }

  // Vérifier que l'identifiant de l'utilisateur, si fourni, est un nombre entier
  if (user_id !== undefined && !Number.isInteger(user_id)) {
    throw new AppError(
      "L'identifiant de l'utilisateur n'est pas valide !",
      400
    );
  }

  // Appeler le service pour mettre à jour la tâche
  const rows = await updateTaskService(Number(id), {
    name: trimmedName,
    description,
    status,
    points,
    user_id,
  });

  // Renvoyer la tâche mise à jour.
  res.status(200).json(rows);
}

//Le controller contrôle les requête et les réponses: (Bon format? Est-ce que j'ai les bonnes infos, au bon format pour ma BDD)
async function getAllTasksController(req, res) {
  const tasks = await getAllTasksService();
  res.status(200).json(tasks);
}

async function getTasksByUserController(req, res) {
  const tasksByUser = await getTasksByUserService(req.user.userId); //Ne pas oublier de passer l'id en paramètre
  res.status(200).json(tasksByUser);
}

async function getTasksByUserIdController(req, res) {
  const { id: userId } = req.params;
  //Validation : Vérifier que mon id est bien un nombre: Question de sécurité
  if (!userId || !Number.isInteger(Number(userId)) || Number(userId) <= 0) {
    throw new AppError(
      "L'id de l'utilisateur doit être un nombre valide.",
      400
    );
  }
  const tasksByUserId = await getTasksByUserService(Number(userId));
  res.status(200).json(tasksByUserId);
}

async function deleteTaskController(req, res) {
  const { id } = req.params;
  if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
    throw new AppError("L'identifiant non valide !", 400);
  }
  const rows = await deleteTaskService(Number(id));
  if (rows === false) {
    throw new AppError('Ressource introuvable...', 404);
  }
  return res.status(204).send();
}

export {
  createTaskController,
  updateTaskController,
  getAllTasksController,
  getTasksByUserController,
  getTasksByUserIdController,
  deleteTaskController,
};
