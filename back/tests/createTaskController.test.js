import { it, expect, jest } from '@jest/globals';

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
  // WHEN + THEN
  await expect(createTaskController(req, res)).rejects.toMatchObject({
    statusCode: 400,
    message: 'Le nom de la tâche doit être un champ de caractère',
  });
});

it('données invalides NAME pas un string réponse 400', async () => {
  // GIVEN : je définis mes données d'entrée au départ du test
  // ici une tache sans nom
  const req = {
    body: {
      name: 1,
      description: "Nettoyer l'enclos",
      points: 5,
      assignment: '1',
    },
  };
  const res = createMockRes();

  // WHEN + THEN
  await expect(createTaskController(req, res)).rejects.toMatchObject({
    statusCode: 400,
    message: 'Le nom de la tâche doit être un champ de caractère',
  });
});

it('données invalides ASSIGNMENT manquant réponse 400', async () => {
  // GIVEN : construction objet tâche avec assignment === null

  // objet req fictif
  const req = {
    body: {
      name: 'bla',
      description: 'blabla',
      points: 50,
    },
  };

  // objet res fictif
  const res = createMockRes();

  // WHEN + THEN
  await expect(createTaskController(req, res)).rejects.toMatchObject({
    statusCode: 400,
    message: 'Un membre doit être assigné à la tâche',
  });
});

it('données invalides si id membre n est pas un nombre entier réponse 400', async () => {
  //GIVEN: construction objet membre pas un nombre entier

  //objet req fictif
  const req = {
    body: {
      name: 'coller',
      description: 'ton frère',
      points: 100,
      assignment: 'Léa',
    },
  };
  const res = createMockRes();

  //WHEN: on appelle le controlleur

  await expect(createTaskController(req, res)).rejects.toMatchObject({
    statusCode: 400,
    message: "L'identifiant du membre assigné doit être un nombre entier",
  });
});

it('donnée invalide si POINT n est pas un nombre', async () => {
  //GIVEN: construction objet POINT pas un nombre et doit être supérieur à zéro

  //objet req fictif
  const req = {
    body: {
      name: 'vendre',
      description: 'toujours ton frère',
      points: 'trop fort',
      assignment: 1,
    },
  };
  const res = createMockRes();
  await expect(createTaskController(req, res)).rejects.toMatchObject({
    statusCode: 400,
    message:
      'La variable point est de type number et être strictement supérieur à zéro',
  });
});

it('donnée invalide si POINT n est pas supérieur à zéro', async () => {
  //GIVEN: construction objet POINT pas un nombre et doit être supérieur à zéro

  //objet req fictif
  const req = {
    body: {
      name: 'vendre',
      description: 'toujours ton frère',
      points: 0,
      assignment: 1,
    },
  };
  const res = createMockRes();
  await expect(createTaskController(req, res)).rejects.toMatchObject({
    statusCode: 400,
    message:
      'La variable point est de type number et être strictement supérieur à zéro',
  });
});
