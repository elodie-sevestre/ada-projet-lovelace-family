import { describe, it, expect, jest } from '@jest/globals';

// Donnée simulée par défaut, pour représenter une vraie liste de tâches
const DEFAULT_TASKS = [
  { id: 1, name: 'Ranger' },
  { id: 2, name: 'Nourrir' },
];

// Interrupteurs : permettent de faire échouer volontairement
// un service pour UN SEUL test précis, sans méthode Jest de mock
let mockErrorGetAllTasks = false;
let mockErrorGetTasksByUser = false;

//Capture l'id reçu par getTaskUserService:
let receivedUserId = null;

// 1 - MOCK DU SERVICE: Qaund on appelle le service, plutôt que d'utiliser le service, on utilise cette fonction de simulation
jest.unstable_mockModule('../src/services/tasksServices.js', () => ({
  getAllTasksService: async () => {
    if (mockErrorGetAllTasks) {// si l'erreur est attendue dans le test
      mockErrorGetAllTasks = false; // on réinitialise pour ne pas affecter les tests suivants
      throw new Error('Erreur DB simulée'); //on renvoie une erreur
    }
    return DEFAULT_TASKS; //Sinon on retourne la donnée simulée
  },
  // Un seul et même service est utilisé par getTasksByUserController
  // ET getTasksByUserIdController — donc un seul interrupteur suffit ici
  getTasksByUserService: async () => {
    if (mockErrorGetTasksByUser) {
      mockErrorGetTasksByUser = false;
      throw new Error('Erreur DB simulée');
    }
    return undefined;
  },
  //Service mocké pour vérifier que l'id :
  getTasksByUserService: async (userId) => {
  receivedUserId = userId; // on note ce qu'on a vraiment reçu
  if (mockErrorGetTasksByUser) {
    mockErrorGetTasksByUser = false;
    throw new Error('Erreur DB simulée');
  }
  return DEFAULT_TASKS;
},
  createTaskServices: async () => undefined,
  updateTaskService: async () => undefined,
  deleteTaskService: async () => undefined,
}));

// 2 - IMPORT DYNAMIQUE, après le mock
const {
  getAllTasksController,
  getTasksByUserController,
  getTasksByUserIdController,
} = await import('../src/controllers/tasksControllers.js');

// 3 - FONCTION POUR CREER UNE FAUSSE RESPONSE: 

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

// 4 - SUITE DE TESTS

describe('getAllTasksController : Vérification de la récupération de toutes les tâches', () => {
  it('Vérifier que les tâches sont bien récupérées', async () => {
    // GIVEN
    const req = {};
    const res = createMockRes();

    // WHEN
    await getAllTasksController(req, res);

    // THEN
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(DEFAULT_TASKS);
  });

  it("Vérifier que si le service échoue, l'erreur remonte", async () => {
    // GIVEN
    const req = {};
    const res = createMockRes();
    mockErrorGetAllTasks = true;

    // WHEN / THEN
    // Comme il n'y a plus de try/catch dans le controller,
    // l'appel rejette directement avec l'erreur du service
    await expect(getAllTasksController(req, res)).rejects.toThrow(
      'Erreur DB simulée'
    );
  });
});

describe('getTasksByUserController : Vérification de la récupération des tâches par utilisateur connecté', () => {
  it('Vérifier que les tâches du user connecté sont bien récupérées', async () => {
    // GIVEN : req.user est rempli par le middleware requireAuth (simulé ici directement)
    const req = { user: { userId: 5, role: 'Member' } };
    const res = createMockRes();

    // WHEN
    await getTasksByUserController(req, res);

    // THEN
    expect(res.statusCode).toBe(200);
    expect(receivedUserId).toBe(5);
  });

  it("Vérifier que si le service échoue, l'erreur remonte", async () => {
    // GIVEN
    const req = { user: { userId: 5, role: 'Member' } };
    const res = createMockRes();
    mockErrorGetTasksByUser = true;

    // WHEN / THEN
    await expect(getTasksByUserController(req, res)).rejects.toThrow(
      'Erreur DB simulée'
    );
  });
});

describe("getTasksByUserIdController : Vérification que l'admin peut récupérer les tâches d'un utilisateur en particulier", () => {
  it("Vérifier que si l'id est manquant, l'erreur AppError 400 est levée", async () => {
    // GIVEN
    const req = { params: {} };
    const res = createMockRes();

    // WHEN / THEN
    await expect(
      getTasksByUserIdController(req, res)
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "L'id de l'utilisateur doit être un nombre valide.",
    });
  });

  it("Vérifier que si l'id n'est pas un nombre, l'erreur AppError 400 est levée", async () => {
    // GIVEN
    const req = { params: { id: 'abc' } };
    const res = createMockRes();

    // WHEN / THEN
    await expect(
      getTasksByUserIdController(req, res)
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "L'id de l'utilisateur doit être un nombre valide.",
    });
  });

  it("Vérifier que si l'id est valide, ça retourne bien 200", async () => {
    // GIVEN
    const req = { params: { id: '3' } };
    const res = createMockRes();

    // WHEN
    await getTasksByUserIdController(req, res);

    // THEN
    expect(res.statusCode).toBe(200);
    expect(receivedUserId).toBe('3');
  });

  it("Vérifier que si le service échoue, l'erreur remonte", async () => {
    // GIVEN
    const req = { params: { id: '3' } };
    const res = createMockRes();
    mockErrorGetTasksByUser = true;

    // WHEN / THEN
    await expect(
      getTasksByUserIdController(req, res)
    ).rejects.toThrow('Erreur DB simulée');
  });
});