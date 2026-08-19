import { describe, it, expect, jest } from '@jest/globals';

// 1 - MOCK DU SERVICE
jest.unstable_mockModule('../src/services/tasksServices.js', () => ({
  getTasksByUserService: jest.fn(),
  getAllTasksService: jest.fn(),
  createTaskServices: jest.fn(),
  updateTaskService: jest.fn(),
  deleteTaskService: jest.fn(),
}));

// 2 - IMPORT DYNAMIQUE
const { getTasksByUserController } =
  await import('../src/controllers/tasksControllers.js');
const { getTasksByUserService } =
  await import('../src/services/tasksServices.js');

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
describe('Valider récupération des tâches par user', () => {
  // Test 1 : id complètement absent
  it("Vérifier que si l'id est manquant, retourne 400", async () => {
    // GIVEN : on prépare des données d'entrée qui simulent une requête sans id
    const req = { params: {} }; // pas de propriété "id" du tout
    const res = createMockRes();

    // WHEN : on appelle le controller avec ces fausses req/res
    // (await car le controller est une fonction async)
    await getTasksByUserController(req, res);

    // THEN : on vérifie que le controller a bien réagi en renvoyant un 400
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "L'id de l'utilisateur doit être un nombre valide.",
    });
  });

  // Test 2 : id présent mais dans un mauvais format
  it("Vérifier que si l'id n'est pas un nombre, retourne 400", async () => {
    // GIVEN : cette fois, req.params.id existe, mais c'est une chaîne
    // non numérique ("abc"), donc Number("abc") donnera NaN
    const req = { params: { id: 'abc' } };
    const res = createMockRes();

    // WHEN : on appelle le controller
    await getTasksByUserController(req, res);

    // THEN : le controller doit détecter que isNaN(Number("abc")) est vrai,
    // et donc renvoyer 400 comme dans le cas précédent
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "L'id de l'utilisateur doit être un nombre valide.",
    });
  });

  // Test 3 : id présent et valide
  it("Vérifier que si l'id est valide ça retourne bien 200", async () => {
    // GIVEN : req.params.id contient une chaîne numérique valide ("3"),
    const req = { params: { id: '3' } };
    const res = createMockRes();

    // WHEN : on appelle le controller
    await getTasksByUserController(req, res);

    // THEN :
    // 1er expect : on vérifie que le controller a bien transmis l'id ("3")
    // tel quel au service — pas de conversion, pas de mauvaise donnée
    expect(getTasksByUserService).toHaveBeenCalledWith('3');
    // 2e expect : on vérifie que la réponse finale est bien un succès (200),
    // puisque l'id est valide et que le service (mocké) ne renvoie pas d'erreur
    expect(res.statusCode).toBe(200);
  });

  // Test 4 : le service échoue (erreur technique, ex: panne DB)
  it('Vérifier que si le service rejette une erreur, retourne 500', async () => {
    // GIVEN : on prépare une requête avec un id valide (la validation passera),
    // et on force le mock du service à rejeter une erreur pour CET appel précis
    // (mockRejectedValueOnce = seulement la prochaine fois, pas tous les appels suivants)
    const req = { params: { id: '3' } };
    const res = createMockRes();
    getTasksByUserService.mockRejectedValueOnce(new Error('Erreur DB simulée'));

    // WHEN : on appelle le controller — comme le service rejette,
    // le bloc catch() du controller va s'activer automatiquement
    await getTasksByUserController(req, res);

    // THEN : on vérifie que le controller a bien attrapé l'erreur
    // et renvoyé un code 500, sans faire planter tout le serveur
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: 'Détail erreur: Error: Erreur DB simulée',
    });
  });
});
