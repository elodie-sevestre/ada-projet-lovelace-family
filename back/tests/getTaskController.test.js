import { describe, it, expect, jest } from '@jest/globals';

// Donnée simulée par défaut, pour représenter une vraie liste de tâches
const DEFAULT_TASKS = [
  { id: 1, name: 'Ranger' },
  { id: 2, name: 'Nourrir' },
];

// Variables de contrôle : permettent de faire échouer volontairement
// un service pour UN SEUL test précis, sans toucher aux méthodes Jest
let simulerErreurGetAll = false;
let simulerErreurGetByUser = false;

// 1 - MOCK DU SERVICE, écrit entièrement à la main
jest.unstable_mockModule('../src/services/tasksServices.js', () => ({
  getAllTasksService: async () => {
    if (simulerErreurGetAll) {
      simulerErreurGetAll = false; // on réinitialise pour ne pas affecter les tests suivants
      throw new Error('Erreur DB simulée');
    }
    return DEFAULT_TASKS;
  },
  getTasksByUserService: async (id) => {
    if (simulerErreurGetByUser) {
      simulerErreurGetByUser = false;
      throw new Error('Erreur DB simulée');
    }
    return undefined;
  },
  createTaskServices: async () => undefined,
  updateTaskService: async () => undefined,
  deleteTaskService: async () => undefined,
}));

// 2 - IMPORT DYNAMIQUE, après le mock
const { getTasksByUserController, getAllTasksController } =
  await import('../src/controllers/tasksControllers.js');

// 3 - FONCTION POUR CREER UNE FAUSSE RESPONSE
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
describe('Valider récupération des tâches', () => {
  // Test 1 : getAllTasksController — succès
  it('Vérifier que les tâches sont bien récupérées', async () => {
    const req = {};
    const res = createMockRes();

    await getAllTasksController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(DEFAULT_TASKS);
  });

  // Test 2 : getAllTasksController — le service échoue
  it('Vérifier que si getAllTasksService échoue, retourne 500', async () => {
    const req = {};
    const res = createMockRes();
    simulerErreurGetAll = true;

    await getAllTasksController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: 'Détails erreur Error: Erreur DB simulée',
    });
  });

  // Test 3 : getTasksByUserController — id manquant
  it("Vérifier que si l'id est manquant, retourne 400", async () => {
    const req = { params: {} };
    const res = createMockRes();

    await getTasksByUserController(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "L'id de l'utilisateur doit être un nombre valide.",
    });
  });

  // Test 4 : getTasksByUserController — mauvais format
  it("Vérifier que si l'id n'est pas un nombre, retourne 400", async () => {
    const req = { params: { id: 'abc' } };
    const res = createMockRes();

    await getTasksByUserController(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "L'id de l'utilisateur doit être un nombre valide.",
    });
  });

  // Test 5 : getTasksByUserController — id valide
  it("Vérifier que si l'id est valide ça retourne bien 200", async () => {
    const req = { params: { id: '3' } };
    const res = createMockRes();

    await getTasksByUserController(req, res);

    expect(res.statusCode).toBe(200);
  });

  // Test 6 : getTasksByUserController — le service échoue
  it('Vérifier que si le service rejette une erreur, retourne 500', async () => {
    const req = { params: { id: '3' } };
    const res = createMockRes();
    simulerErreurGetByUser = true;

    await getTasksByUserController(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: 'Détail erreur: Error: Erreur DB simulée',
    });
  });
});
