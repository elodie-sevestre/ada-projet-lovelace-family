import { describe, it, expect, jest } from '@jest/globals';

// ------------------------------------------------------------------------------
// ------------------------------   MOCKS   -------------------------------------
// ------------------------------------------------------------------------------

//* On dit à Jest : "n'utilise pas le vrai fichier tasksServices.js, utilise plutôt une fausse version que je fabrique moi-même"
//* Comme ça, pas besoin de vraie base de données pour faire le test4

// Initialisation

// Objet renvoyé par défaut par le service mocké, pour ne jamais taper la vraie BDD
const UPDATED_TASK = {
  id: 1,
  name: 'Test pour mise à jour de la tâche',
  description: 'Hourra !!',
  status: 'TERMINE',
  points: 100,
};
// mock des services : pas de valeurs par défaut pour garder de la flexibilité
// le mock sera configuré dans chaque test
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

const { updateTaskController } =
  await import('../src/controllers/tasksControllers.js');

// id pour le service
const { updateTaskService } = await import('../src/services/tasksServices.js');

//! MOCK res
// création d'une fausse response avec le pattern AAA (Arrange Act Assert) -> part du body et crée l'objet res qui va circuler dans le code

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

// ------------------------------------------------------------------------------
// ------------------------------   TESTS   -------------------------------------
// ------------------------------------------------------------------------------

// describe = une boîte qui range tous les tests qui parlent du même sujet

describe('Valider que les données à modifier sont bien récupérées', () => {
  // it = un seul test, une seule histoire qu'on raconte à Jest
  it("renvoie une erreur 400 si l'id n'est pas valide", async () => {
    //! GIVEN
    // préparation d'une fausse request pour tester si le controller détecte l'erreur
    // req : je mets "deux" au lieu d'un vrai chiffre, exprès, pour le piéger

    const req = { params: { id: 'deux' }, body: {} };

    // res : on récupère la fausse réponse

    const res = updateMockRes();

    //! WHEN
    // On lance le controller avec les faux "objets" req et res

    await updateTaskController(req, res);

    //! THEN
    // On vérifie qu'on récupère l'erreur : code HTTP + message (même message que dans le service)

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "L'identifiant de la tâche n'est pas valide !",
    });
  });
  it("renvoie une erreur 400 si le champ NAME n'est pas une string", async () => {
    //! GIVEN
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
    //! WHEN
    await updateTaskController(req, res);
    //! THEN
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Le nom de la tâche est requis ou mal renseigné!',
    });
  });
  it('renvoie une erreur 400 si le champ NAME est vide', async () => {
    //! GIVEN
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
    //! WHEN
    await updateTaskController(req, res);
    //! THEN
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Le nom de la tâche est requis ou mal renseigné!',
    });
  });
  it("renvoie une erreur 400 si le champ DESCRIPTION n'est pas du texte", async () => {
    //! GIVEN
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
    //! WHEN
    await updateTaskController(req, res);
    //! THEN
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'La description doit être du texte !',
    });
  });
  it("renvoie une erreur 400 si le champ STATUS n'est pas renseigné", async () => {
    //! GIVEN
    const req = {
      params: { id: 1 },
      body: {
        name: 'Test du champ status',
        description: 'test',
        points: 10,
      },
    };
    const res = updateMockRes();
    //! WHEN
    await updateTaskController(req, res);
    //! THEN
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Le statut est requis !',
    });
  });
  it("renvoie une erreur 400 si la valeur du champ STATUS n'est pas autorisée", async () => {
    //! GIVEN
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
    //! WHEN
    await updateTaskController(req, res);
    //! THEN
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "La valeur du statut n'est pas autorisée !",
    });
  });
  it("erreur 400 si POINTS n'est pas un nombre", async () => {
    //! GIVEN
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
    //!WHEN
    await updateTaskController(req, res);
    //! THEN
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Les points doivent être un nombre entier !',
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
    await updateTaskController(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "L'identifiant de l'utilisateur n'est pas valide !",
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

describe('Gérer les erreurs du service', () => {
  it('retourne le statusCode et le message si le service renvoie une erreur', async () => {
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

    // WHEN
    await updateTaskController(req, res);

    // THEN
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBeDefined(); // Juste vérifier qu'il y a un message
  });
  it('retourne le status par défaut et le message si le service renvoie une erreur', async () => {
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

    // WHEN
    await updateTaskController(req, res);

    // THEN
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBeDefined(); // Juste vérifier qu'il y a un message
  });
});
