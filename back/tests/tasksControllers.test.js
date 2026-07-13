import { describe, it, expect, jest } from "@jest/globals";
//Initialisation du mock
// Objet renvoyé par défaut par le service mocké, pour ne jamais taper la vraie BDD
const DEFAULT_TASK = {
  id: 1,
  name: "Ranger",
  description: null,
  status: "A_FAIRE",
  points: 5,
};
//redefinition des import demandé dans tasksControllers
jest.unstable_mockModule("../src/services/tasksServices.js", () => ({
  createTaskServices: jest.fn(async () => DEFAULT_TASK),
  updateTaskService: jest.fn(async () => DEFAULT_TASK),
  getAllTasksService: jest.fn(async () => ({
    toDoTasks: [],
    finishedTasks: [],
  })),
  getTasksByUserService: jest.fn(async () => ({
    toDoTasks: [],
    finishedTasks: [],
  })),
}));
//

const { createTaskController } =
  await import("../src/controllers/tasksControllers.js");

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

describe("createTaskController — création réussie", () => {
  it("name et points valides → appelle le service (mocké) et renvoie 201", async () => {
    const req = {
      body: { name: "Ranger", description: "Nettoyer l'enclos", points: 5 },
    };
    const res = createMockRes();

    await createTaskController(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(DEFAULT_TASK);
  });
});
