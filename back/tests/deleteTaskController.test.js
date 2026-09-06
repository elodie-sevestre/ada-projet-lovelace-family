import { describe, it, expect, jest } from '@jest/globals';

// ------------------------------------------------------------------------------
// ------------------------------   MOCKS   -------------------------------------
// ------------------------------------------------------------------------------

//* On dit à Jest : "n'utilise pas le vrai fichier tasksServices.js, utilise plutôt une fausse version que je fabrique moi-même"
//* Comme ça, pas besoin de vraie base de données pour faire le test4

// Initialisation

jest.unstable_mockModule('../src/services/tasksServices.js', () => ({
  createTaskServices: jest.fn(),
  updateTaskService: jest.fn(),
  getAllTasksService: jest.fn(),
  getTasksByUserService: jest.fn(),
  deleteTaskService: jest.fn(),
}));

//! Important
// On récupère le controller APRÈS avoir créé la fausse version au-dessus.
// Si on le faisait avant, le controller irait chercher le vrai fichier, pas le faux.

const { deleteTaskController } =
  await import('../src/controllers/tasksControllers.js');

const { deleteTaskService } = await import('../src/services/tasksServices.js');

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

// describe = une boîte qui range tous les tests qui parlent du même sujet

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
    await deleteTaskController(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "L'identifiant non valide !" });
  });
  it("renvoi erreur 400 si ID n'est pas un nombre", async () => {
    const req = { params: { id: 'deux' }, body: {} };
    const res = deleteMockRes();
    await deleteTaskController(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "L'identifiant non valide !" });
  });
  it('renvoi erreur 404 si la tâche à supprimer est introuvable', async () => {
    const req = { params: { id: 2 }, body: {} };
    const res = deleteMockRes();
    deleteTaskService.mockResolvedValue(false);
    await deleteTaskController(req, res);
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Ressource introuvable...' });
  });
  it("renvoi erreur 500 s'il y a une erreur lors de la suppression de la tâche", async () => {
    const req = { params: { id: 2 }, body: {} };
    const res = deleteMockRes();
    deleteTaskService.mockRejectedValue(new Error('DB down'));
    await deleteTaskController(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: 'Erreur lors de la suppression de la tâche',
    });
  });
});
