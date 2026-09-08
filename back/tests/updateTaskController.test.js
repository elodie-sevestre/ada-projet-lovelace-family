import { describe, it, expect, jest } from '@jest/globals';

// ------------------------------   MOCKS   -------------------------------------

// 1. Données de tests
// Objet renvoyé par défaut par le service mocké, pour ne jamais taper la vraie BDD

const UPDATED_TASK = {
  id: 1,
  name: 'Test pour mise à jour de la tâche',
  description: 'Hourra !!',
  status: 'TERMINE',
  points: 100,
};

// 2. Mock des services
// pas de valeurs par défaut pour garder de la flexibilité
// le mock sera configuré dans chaque test

jest.unstable_mockModule('../src/services/tasksServices.js', () => ({
  createTaskServices: jest.fn(),
  updateTaskService: jest.fn(),
  getAllTasksService: jest.fn(),
  getTasksByUserService: jest.fn(),
  deleteTaskService: jest.fn(),
}));

// 3. Controller
// import APRÈS le mock, sinon c'est le vrai tasksServices.js qui est chargé

const { updateTaskController } =
  await import('../src/controllers/tasksControllers.js');

// 4. Service
// on récupère la référence au mock pour le configurer dans chaque test
// (updateTaskService.mockResolvedValue / mockRejectedValue)

const { updateTaskService } = await import('../src/services/tasksServices.js');

// 5. MOCK res

function updateMockRes() {
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

// ------------------------------   TESTS   -------------------------------------

describe('Valider que les données à modifier sont bien récupérées', () => {
  it("renvoie une erreur 400 si l'id n'est pas valide", async () => {
    // GIVEN
    const req = { params: { id: 'deux' }, body: {} };
    const res = updateMockRes();

    // WHEN + THEN
    await expect(updateTaskController(req, res)).rejects.toMatchObject({
      statusCode: 400,
      message: "L'identifiant de la tâche n'est pas valide !",
    });
  });

  it("renvoie une erreur 400 si le champ NAME n'est pas une string", async () => {
    // GIVEN
    const req = {
      params: { id: 1 },
      body: {
        name: 5,
        description: null,
        status: 'A_FAIRE',
        points: 100,
      },
    };
    const res = updateMockRes();

    // WHEN + THEN
    await expect(updateTaskController(req, res)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Le nom de la tâche est requis ou mal renseigné!',
    });
  });

  it('renvoie une erreur 400 si le champ NAME est vide', async () => {
    // GIVEN
    const req = {
      params: { id: 1 },
      body: {
        name: '  ',
        description: null,
        status: 'A_FAIRE',
        points: 100,
      },
    };
    const res = updateMockRes();
    // WHEN + THEN
    await expect(updateTaskController(req, res)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Le nom de la tâche est requis ou mal renseigné!',
    });
  });

  it("renvoie une erreur 400 si le champ DESCRIPTION n'est pas du texte", async () => {
    // GIVEN
    const req = {
      params: { id: 1 },
      body: {
        name: 'Test du champ description',
        description: 5,
        status: 'A_FAIRE',
        points: 10,
      },
    };
    const res = updateMockRes();

    // WHEN + THEN
    await expect(updateTaskController(req, res)).rejects.toMatchObject({
      statusCode: 400,
      message: 'La description doit être du texte !',
    });
  });

  it("renvoie une erreur 400 si le champ STATUS n'est pas renseigné", async () => {
    // GIVEN
    const req = {
      params: { id: 1 },
      body: {
        name: 'Test du champ status',
        description: 'test',
        points: 10,
      },
    };
    const res = updateMockRes();
    // WHEN + THEN
    await expect(updateTaskController(req, res)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Le statut est requis !',
    });
  });

  it("renvoie une erreur 400 si la valeur du champ STATUS n'est pas autorisée", async () => {
    // GIVEN
    const req = {
      params: { id: 1 },
      body: {
        name: 'Test du champ status',
        description: 'test',
        status: 'EN_COURS',
        points: 10,
      },
    };
    const res = updateMockRes();

    // WHEN + THEN
    await expect(updateTaskController(req, res)).rejects.toMatchObject({
      statusCode: 400,
      message: "La valeur du statut n'est pas autorisée !",
    });
  });

  it("erreur 400 si POINTS n'est pas un nombre", async () => {
    // GIVEN
    const req = {
      params: { id: 1 },
      body: {
        name: 'Test du champ points',
        description: 'test',
        status: 'A_FAIRE',
        points: 'dix',
      },
    };
    const res = updateMockRes();

    // WHEN + THEN
    await expect(updateTaskController(req, res)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Les points doivent être un nombre entier !',
    });
  });

  it("erreur 400 si l'ID de l'utilisateur n'est pas un nombre entier", async () => {
    const req = {
      params: { id: 1 },
      body: {
        name: "Test de l'ID",
        description: 'test',
        status: 'A_FAIRE',
        points: 10,
        user_id: 'deux',
      },
    };
    const res = updateMockRes();
    // WHEN + THEN
    await expect(updateTaskController(req, res)).rejects.toMatchObject({
      statusCode: 400,
      message: "L'identifiant de l'utilisateur n'est pas valide !",
    });
  });
});

describe('Valider que la tâche est bien modifiée', () => {
  it('succés 200 si tâche a bien été mise à jour', async () => {
    const req = {
      params: { id: 1 },
      body: {
        name: 'Test pour mise à jour de la tâche',
        description: 'Hourra !!',
        status: 'A_FAIRE',
        points: 100,
      },
    };
    const res = updateMockRes();

    updateTaskService.mockResolvedValue(UPDATED_TASK);

    await updateTaskController(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(UPDATED_TASK);
  });
});

describe('Propagation des erreurs du service', () => {
  it('propage le statusCode et le message si le service porte un statusCode', async () => {
    // GIVEN: configurer le mock pour qu'il lance une erreur
    const mockError = new Error('Erreur base de données');
    mockError.statusCode = 404;
    updateTaskService.mockRejectedValue(mockError);

    const req = {
      params: { id: 1 },
      body: {
        name: 'Test',
        description: 'test',
        status: 'A_FAIRE',
        points: 10,
      },
    };
    const res = updateMockRes();

    // WHEN + THEN
    await expect(updateTaskController(req, res)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Erreur base de données',
    });
  });

  it("propage l'erreur brute si le service n'a pas de statusCode", async () => {
    // GIVEN: configurer le mock pour qu'il lance une erreur
    const mockError = new Error('Erreur base de données');
    // mockError.statusCode = 404;
    updateTaskService.mockRejectedValue(mockError);

    const req = {
      params: { id: 1 },
      body: {
        name: 'Test',
        description: 'test',
        status: 'A_FAIRE',
        points: 10,
      },
    };
    const res = updateMockRes();

    // WHEN + THEN
    await expect(updateTaskController(req, res)).rejects.toThrow(
      'Erreur base de données'
    );
  });
});
