import { describe, it, expect, jest } from '@jest/globals';

// ------------------------------   MOCKS   -------------------------------------

// Fausse version de loginServices.js : pas de vraie BDD, pas de JWT réel.
jest.unstable_mockModule('../src/services/loginServices.js', () => ({
  createLoginService: jest.fn(),
  connexionService: jest.fn(),
}));

// Import APRÈS le mock.
const { connexionController } =
  await import('../src/controllers/loginControllers.js');

const { connexionService } = await import('../src/services/loginServices.js');

// Fausse réponse Express.
function connexionMockRes() {
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

// Corps valide réutilisé, qu'on modifie au cas par cas.
const VALID_BODY = { mail: 'lea@mail.com', password: 'password' };

// ------------------------------   TESTS   -------------------------------------

describe('Valider les entrées de connexion', () => {
  it('renvoie 400 si mail ou password est manquant', async () => {
    // GIVEN : body vide
    const req = { body: {} };
    const res = connexionMockRes();

    // WHEN
    await connexionController(req, res);

    // THEN (note : le controller renvoie la clé "erreur", pas "error")
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Email et mot de passe requis' });
  });

  it("renvoie 400 si le format de l'email est invalide", async () => {
    // GIVEN : mail sans @
    const req = { body: { ...VALID_BODY, mail: 'lea-mail.com' } };
    const res = connexionMockRes();

    // WHEN
    await connexionController(req, res);

    // THEN
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Format Email invalide' });
  });

  it('renvoie 400 si le password fait moins de 8 caractères', async () => {
    // GIVEN : password trop court
    const req = { body: { ...VALID_BODY, password: 'court' } };
    const res = connexionMockRes();

    // WHEN
    await connexionController(req, res);

    // THEN
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Format password invalide' });
  });
});

describe('Valider la connexion elle-même', () => {
  it('renvoie 401 si le service ne renvoie pas de token (identifiants faux)', async () => {
    // GIVEN : service renvoie null
    const req = { body: { ...VALID_BODY } };
    const res = connexionMockRes();
    connexionService.mockResolvedValue(null);

    // WHEN
    await connexionController(req, res);

    // THEN
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Identifiants invalides' });
  });

  it('renvoie le token si les identifiants sont valides', async () => {
    // GIVEN : service renvoie un token
    const req = { body: { ...VALID_BODY } };
    const res = connexionMockRes();
    connexionService.mockResolvedValue('fake.jwt.token');

    // WHEN
    await connexionController(req, res);

    // THEN : res.json({ token }) appelé directement, sans res.status -> statusCode reste null
    expect(res.body).toEqual({ token: 'fake.jwt.token' });
    expect(connexionService).toHaveBeenCalledWith('lea@mail.com', 'password');
  });

  it('renvoie 500 si le service lève une erreur', async () => {
    // GIVEN : service throw
    const req = { body: { ...VALID_BODY } };
    const res = connexionMockRes();
    connexionService.mockRejectedValue(new Error('DB down'));

    // WHEN
    await connexionController(req, res);

    // THEN
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Erreur serveur' });
  });
});
