import { describe, it, expect, jest } from "@jest/globals";

// 1 - MOCK DU SERVICE
// On remplace tout le module tasksServices.js par des fonctions vides (jest.fn()).
// Objectif : le controller croit appeler le vrai service, mais en réalité
// il appelle une fonction factice qui ne touche jamais la vraie base de données.

jest.unstable_mockModule("../src/services/tasksServices.js", () => ({
  getTasksByUserService: jest.fn(),
  getAllTasksService: jest.fn(),
  createTaskServices: jest.fn(),
  updateTaskService: jest.fn(),
}));

// 2 - IMPORT DYNAMIQUE:
// On importe le controller APRES avoir déclaré le mock ci-dessus.
// Si on l'importait normalement (import classique en haut de fichier),
// il chargerait la vraie version du service avant que le mock soit en place.
const { getTasksByUserController } =
  await import("../src/controllers/tasksControllers.js");

const { getTasksByUserService } =
  await import("../src/services/tasksServices.js");

// 3 - FABRIQUE DE FAUX "res" EXPRESS
// Express fournit normalement un vrai objet res avec .status() et .json().
// Ici, on n'a pas de vrai serveur qui tourne, donc on fabrique un res factice
// avec les mêmes méthodes, pour que le controller puisse s'exécuter sans planter.
function createMockRes() {
  const res = {
    // jest.fn() crée une fonction "espion" : elle ne fait rien de réel,
    // mais elle enregistre chaque appel (avec quels arguments) pour qu'on
    // puisse vérifier ça plus tard avec expect(...).toHaveBeenCalledWith(...)
    status: jest.fn().mockReturnThis(),
    // .mockReturnThis() permet de reproduire le chaînage res.status(400).json(...)
    // en faisant que res.status(...) renvoie l'objet res lui-même
    json: jest.fn(),
  };
  return res;
}

// 4 - SUITE DE TESTS
describe("Valider récupération des tâches par user", () => {
  // --- Test 1 : id complètement absent ---
  it("Vérifier que si l'id est manquant, retourne 400", async () => {
    // GIVEN : on prépare des données d'entrée qui simulent une requête sans id
    const req = { params: {} }; // pas de propriété "id" du tout
    const res = createMockRes();

    // WHEN : on appelle le controller avec ces fausses req/res
    // (await car le controller est une fonction async)
    await getTasksByUserController(req, res);

    // THEN : on vérifie que le controller a bien réagi en renvoyant un 400
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // --- Test 2 : id présent mais dans un mauvais format ---
  it("Vérifier que si l'id n'est pas un nombre, retourne 400", async () => {
    // GIVEN : cette fois, req.params.id existe, mais c'est une chaîne
    // non numérique ("abc"), donc Number("abc") donnera NaN
    const req = { params: { id: "abc" } };
    const res = createMockRes();

    // WHEN : on appelle le controller
    await getTasksByUserController(req, res);

    // THEN : le controller doit détecter que isNaN(Number("abc")) est vrai,
    // et donc renvoyer 400 comme dans le cas précédent
    expect(res.status).toHaveBeenCalledWith(400);
  });

  //--- Test 3 : Test l'id valide
  it("Vérifier que si l'id est valide ça retourne bien 200", async () => {
    // GIVEN : req.params.id contient une chaîne numérique valide ("3"),
    // donc la validation du controller (!id || isNaN(Number(id))) retourne false
    // et le controller devrait continuer vers l'appel du service
    const req = { params: { id: "3" } };
    const res = createMockRes();
    // WHEN : on appelle le controller
    await getTasksByUserController(req, res);
    // THEN :
    // 1er expect : on vérifie que le controller a bien transmis l'id ("3")
    // tel quel au service — pas de conversion, pas de mauvaise donnée
    expect(getTasksByUserService).toHaveBeenCalledWith("3");
    // 2e expect : on vérifie que la réponse finale est bien un succès (200),
    // puisque l'id est valide et que le service (mocké) ne renvoie pas d'erreur
    expect(res.status).toHaveBeenCalledWith(200);
  });

  //--- Test 4 : Test de l'erreur 500
  it("Vérifier que si le service rejette une erreur, retourne 500", async () => {
    // GIVEN : on prépare une requête avec un id valide (la validation passera),
    // et on force le mock du service à rejeter une erreur pour CET appel précis
    // (mockRejectedValueOnce = seulement la prochaine fois, pas tous les appels suivants)
    const req = { params: { id: "3" } };
    const res = createMockRes();
    getTasksByUserService.mockRejectedValueOnce(new Error("Erreur DB simulée"));
    // WHEN : on appelle le controller — comme le service rejette,
    // le bloc catch() du controller va s'activer automatiquement
    await getTasksByUserController(req, res);
    // THEN : on vérifie que le controller a bien attrapé l'erreur
    // et renvoyé un code 500, sans faire planter tout le serveur
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
