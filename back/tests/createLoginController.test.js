import { describe, it, expect, jest } from '@jest/globals';

// ------------------------------   MOCKS   -------------------------------------

// On remplace loginServices.js par une fausse version : pas de vraie BDD, pas de bcrypt.
jest.unstable_mockModule('../src/services/loginServices.js', () => ({
  createLoginService: jest.fn(),
  connexionService: jest.fn(),
}));

// On importe APRÈS le mock, sinon le controller irait chercher le vrai service.
const { createLoginController } =
  await import('../src/controllers/loginControllers.js');

const { createLoginService } = await import('../src/services/loginServices.js');

// Fausse réponse Express : on capture status + body, et send() pour le 204.
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
  res.send = jest.fn(() => res);
  return res;
}

// ------------------------------   TESTS   -------------------------------------

describe('Valider la création du compte (inscription)', () => {
  it('renvoie 400 si le champ requis NAME est manquant', async () => {
    // GIVEN : body sans name
    const req = {
      body: {
        role: 'MEMBER',
        name: '',
        mail: 'lea@mail.com',
        tribe_name: 'la-tribu-de-bernard',
        password: 'password',
      },
    };
    const res = createMockRes();

    // WHEN
    await createLoginController(req, res);

    // THEN
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Champs requis manquants' });
  });

  it('renvoie 400 si le champ requis MAIL est manquant', async () => {
    const req = {
      body: {
        role: 'MEMBER',
        name: 'Léa',
        mail: '',
        tribe_name: 'la-tribu-de-bernard',
        password: 'password',
      },
    };
    const res = createMockRes();

    await createLoginController(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Champs requis manquants' });
  });

  it('renvoie 400 si le champ requis PASSWORD est manquant', async () => {
    const req = {
      body: {
        role: 'MEMBER',
        name: 'Léa',
        mail: 'lea@mail.com',
        tribe_name: 'la-tribu-de-bernard',
        password: '',
      },
    };
    const res = createMockRes();

    await createLoginController(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Champs requis manquants' });
  });

  it('renvoie 204 sans body si le compte est bien créé', async () => {
    // GIVEN : données valides, service OK
    const req = {
      body: {
        role: 'MEMBER',
        name: 'Léa',
        mail: 'lea@mail.com',
        tribe_name: 'la-tribu-de-bernard',
        password: 'password',
      },
    };
    const res = createMockRes();
    createLoginService.mockResolvedValue(undefined);

    // WHEN
    await createLoginController(req, res);

    // THEN
    expect(res.statusCode).toBe(204);
    expect(res.send).toHaveBeenCalled();
    expect(createLoginService).toHaveBeenCalledWith(
      'MEMBER',
      'Léa',
      'lea@mail.com',
      'la-tribu-de-bernard',
      'password'
    );
  });

  it('renvoie 400 si le service échoue (mail déjà utilisé, BDD down...)', async () => {
    // GIVEN : le service lève une erreur
    const req = {
      body: {
        role: 'MEMBER',
        name: 'Léa',
        mail: 'lea@mail.com',
        tribe_name: 'la-tribu-de-bernard',
        password: 'password',
      },
    };
    const res = createMockRes();
    createLoginService.mockRejectedValue(new Error('duplicate key'));

    // WHEN
    await createLoginController(req, res);

    // THEN
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Inscription impossible' });
  });
});
