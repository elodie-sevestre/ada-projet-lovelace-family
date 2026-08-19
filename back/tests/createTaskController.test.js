import { describe, it, expect, jest } from '@jest/globals';

//Initialisation du mock
// Objet renvoyé par défaut par le service mocké, pour ne jamais taper la vraie BDD
const DEFAULT_TASK = {
  id: 1,
  name: 'Ranger',
  description: null,
  assignment: '1',
  points: 5,
};
//redefinition des import demandé dans tasksControllers
jest.unstable_mockModule('../src/services/tasksServices.js', () => ({
  createTaskServices: jest.fn(async () => DEFAULT_TASK),
  updateTaskService: jest.fn(async () => DEFAULT_TASK),
  getAllTasksService: jest.fn(async () => ({
    toDoTasks: [],
    finishedTasks: [],
  })),
  getTasksByUserService: jest.fn(async () => ({
    toDoTasks: [],
    finishedTasks: [],
  })),
  deleteTaskService: jest.fn(async () => true),
}));
//

const { createTaskController } =
  await import('../src/controllers/tasksControllers.js');
await import('../src/controllers/tasksControllers.js');
await import('../src/services/tasksServices.js');

// part du body et crée l'objet res qui va circuler dans le code
function createMockRes() {
  const res = { statusCode: null, body: null };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  return res;
}

describe('createTaskController', () => {
  it('données valides tâche crée réponse 201', async () => {
    const req = {
      body: {
        name: 'Ranger',
        description: "Nettoyer l'enclos",
        points: 5,
        assignment: '1',
      },
    };
    const res = createMockRes();

    await createTaskController(req, res);

    expect(res.body).toEqual(DEFAULT_TASK);
    expect(res.statusCode).toBe(201);
  });

  it('données invalides NAME manquant réponse 400', async () => {
    // GIVEN : je définis mes données d'entrée au départ du test
    // ici une tache sans nom
    const req = {
      body: {
        name: '',
        description: "Nettoyer l'enclos",
        points: 5,
        assignment: '1',
      },
    };
    const res = createMockRes();

    // WHEN : j'appelle le controller pour créer ma tâche
    await createTaskController(req, res);

    // THEN : je m'attends à une erreur car le nom de la tache est obligatoire
    expect(res.body).toEqual(
      'Le nom de la tâche doit être un champ de caractère'
    );
    expect(res.statusCode).toBe(201);
  });
});
