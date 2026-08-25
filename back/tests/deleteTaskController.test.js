import { describe, it, expect, jest } from '@jest/globals';

// ------------------------------------------------------------------------------
// ------------------------------   MOCKS   -------------------------------------
// ------------------------------------------------------------------------------

//* On dit à Jest : "n'utilise pas le vrai fichier tasksServices.js, utilise plutôt une fausse version que je fabrique moi-même"
//* Comme ça, pas besoin de vraie base de données pour faire le test4

// Initialisation

jest.unstable_mockModule('../src/controllers/tasksControllers.js', () => ({
  createTaskServices: jest.fn(),
  updateTaskService: jest.fn(),
  getAllTasksService: jest.fn(),
  getTasksByUserService: jest.fn(),
}));

//! Important
// On récupère le controller APRÈS avoir créé la fausse version au-dessus.
// Si on le faisait avant, le controller irait chercher le vrai fichier, pas le faux.

const { deleteTaskController } =
  await import('../src/controllers/tasksControllers.js');
const { deleteTaskService } = await import('../src/services/tasksServices.js');

function deleteMockRes() {
  const res = { statusCode: null, body: null };
}
