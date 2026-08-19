import { describe, it, expect, jest } from '@jest/globals';

// Initialisation du MOCK
//! On dit à Jest : "n'utilise pas le vrai fichier tasksServices.js, utilise plutôt une fausse version que je fabrique moi-même"
// Comme ça, pas besoin de vraie base de données pour faire le test
jest.unstable_mockModule('../src/services/tasksServices.js', () => ({
  createTaskServices: jest.fn(),
  updateTaskService: jest.fn(),
  getAllTasksService: jest.fn(),
  getTasksByUserService: jest.fn(),
  deleteTaskService: jest.fn(),
}));

// Important : on va chercher le controller APRÈS avoir créé la fausse version au-dessus.
// Si on le faisait avant, le controller irait chercher le vrai fichier, pas le faux.
const { updateTaskController } =
  await import('../src/controllers/tasksControllers.js');
await import('../src/services/tasksServices.js');

// res = création d'une fausse response avec le pattern AAA (Arrange Act Assert) -> part du body et crée l'objet res qui va circuler dans le code
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

// describe = une boîte qui range tous les tests qui parlent du même sujet
describe('Valider que les données à modifier sont bien récupérées', () => {
  // it = un seul test, une seule histoire qu'on raconte à Jest
  it("renvoie une erreur 400 si l'id n'est pas valide", async () => {
    // GIVEN : préparation d'une fausse request pour tester si le controller détecte l'erreur
    // req : je mets "deux" au lieu d'un vrai chiffre, exprès, pour le piéger
    const req = { params: { id: 'deux' }, body: {} };

    const res = updateMockRes();

    // WHEN : on appuie sur "GO", on lance le controller avec nos faux jouets
    await updateTaskController(req, res);
    // await = on attend que le controller ait fini avant de continuer

    // THEN : on va voir si les espions ont bien vu ce qu'on attendait
    expect(res.statusCode).toBe(400);
    // l'espion "status" doit avoir vu passer le nombre 400

    expect(res.body).toEqual({
      error: "L'identifiant de la tâche n'est pas valide !",
    });
    // l'espion "json" doit avoir vu passer exactement ce message d'erreur
    // il faut écrire le message pile comme dans le controller, sinon le test dit "non"
  });
});
