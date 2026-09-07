import { describe, it, expect, jest } from '@jest/globals';

// ------------------------------   MOCKS   -------------------------------------

// 1. Mock des services
// pas de valeurs par défaut pour garder de la flexibilité
// le mock sera configuré dans chaque test

jest.unstable_mockModule('../src/services/tasksServices.js', () => ({
  createTaskServices: jest.fn(),
  updateTaskService: jest.fn(),
  getAllTasksService: jest.fn(),
  getTasksByUserService: jest.fn(),
  deleteTaskService: jest.fn(),
}));

// 2. Controller
// import APRÈS le mock, sinon c'est le vrai tasksServices.js qui est chargé

const { deleteTaskController } =
  await import('../src/controllers/tasksControllers.js');

// 3. Service
// on récupère la référence au mock pour le configurer dans chaque test
// (updateTaskService.mockResolvedValue / mockRejectedValue)

const { deleteTaskService } = await import('../src/services/tasksServices.js');

// 4. MOCK res

function deleteMockRes() {
  const res = { statusCode: null, body: null };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  res.send = jest.fn(() => res);
  return res;
}

// ------------------------------   TESTS   -------------------------------------

describe('Valider que les données sont bien supprimées', () => {
  it('renvoi réponse avec status 204 si la tâche est bien supprimée', async () => {
    const req = { params: { id: 2 }, body: {} };
    const res = deleteMockRes();
    deleteTaskService.mockResolvedValue(true);
    await deleteTaskController(req, res);
    expect(res.statusCode).toBe(204);
    expect(res.send).toHaveBeenCalled();
  });
  it("renvoi erreur 400 si ID n'existe pas", async () => {
    const req = { params: { id: null }, body: {} };
    const res = deleteMockRes();

    await expect(deleteTaskController(req, res)).rejects.toMatchObject({
      statusCode: 400,
      message: "L'identifiant non valide !",
    });
  });

  it("renvoi erreur 400 si ID n'est pas un nombre", async () => {
    const req = { params: { id: 'deux' }, body: {} };
    const res = deleteMockRes();
    await expect(deleteTaskController(req, res)).rejects.toMatchObject({
      statusCode: 400,
      message: "L'identifiant non valide !",
    });
  });
  it('renvoi erreur 404 si la tâche à supprimer est introuvable', async () => {
    const req = { params: { id: 2 }, body: {} };
    const res = deleteMockRes();
    deleteTaskService.mockResolvedValue(false);
    await expect(deleteTaskController(req, res)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Ressource introuvable...',
    });
  });
  it("propage l'erreur du service", async () => {
    const req = { params: { id: 2 }, body: {} };
    const res = deleteMockRes();
    deleteTaskService.mockRejectedValue(new Error('DB down'));
    await expect(deleteTaskController(req, res)).rejects.toThrow('DB down');
  });
});
