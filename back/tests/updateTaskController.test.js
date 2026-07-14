import { jest } from "@jest/globals";

// On dit à Jest : "n'utilise pas le vrai fichier tasksServices.js,
// utilise plutôt une fausse version que je fabrique moi-même"
// Comme ça, pas besoin de vraie base de données pour faire le test
jest.unstable_mockModule("../src/services/tasksServices.js", () => ({
  createTaskServices: jest.fn(),
  updateTaskService: jest.fn(),
  getAllTasksService: jest.fn(),
  getTasksByUserService: jest.fn(),
}));

// Important : on va chercher le controller APRÈS avoir créé la fausse version au-dessus.
// Si on le faisait avant, le controller irait chercher le vrai fichier, pas le faux.
const { updateTaskController } =
  await import("../src/controllers/tasksControllers.js");

describe("Valider que l'id de la tâche est bien un nombre entier valide", () => {
  // describe = une boîte qui range tous les tests qui parlent du même sujet

  it("renvoie une erreur 400 si l'id n'est pas valide", async () => {
    // it = un seul test, une seule histoire qu'on raconte à Jest

    // GIVEN : je prépare mes jouets pour l'histoire
    const req = { params: { id: "deux" }, body: {} };
    // req = une fausse demande envoyée au controller
    // je mets "deux" (une lettre) au lieu d'un vrai chiffre, exprès, pour le piéger

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // res = une fausse réponse, avec deux espions dedans
    // les espions ne font rien, ils regardent juste ce qu'on leur dit et s'en souviennent

    // WHEN : on appuie sur "GO", on lance le controller avec nos faux jouets
    await updateTaskController(req, res);
    // await = on attend que le controller ait fini avant de continuer

    // THEN : on va voir si les espions ont bien vu ce qu'on attendait
    expect(res.status).toHaveBeenCalledWith(400);
    // l'espion "status" doit avoir vu passer le nombre 400

    expect(res.json).toHaveBeenCalledWith({
      error: "L'identifiant de la tâche n'est pas valide !",
    });
    // l'espion "json" doit avoir vu passer exactement ce message d'erreur
    // il faut écrire le message pile comme dans le controller, sinon le test dit "non"
  });
});
