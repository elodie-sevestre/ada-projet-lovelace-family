import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import errorHandler from '../src/middlewares/errorHandler.js';
import AppError from '../src/utils/AppError.js';
import { logger } from '../src/utils/logger.js';

// Faux res : status() et json() chaînables et espionnés
function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

// errorHandler loggue via logger.error sur les 5xx
beforeEach(() => {
  jest.spyOn(logger, 'error').mockImplementation(() => {});
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe('errorHandler', () => {
  it('Erreur < 500 (AppError)', () => {
    // GIVEN
    const err = new AppError('Champs requis manquants', 400);
    const res = mockRes();
    // WHEN
    errorHandler(err, {}, res, jest.fn());
    // THEN
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Champs requis manquants' });
    expect(logger.error).not.toHaveBeenCalled();
  });
  it('Erreur sans statusCode', () => {
    // GIVEN
    const err = new Error('SELECT * FROM users ... fuite SQL');
    const res = mockRes();
    // WHEN
    errorHandler(err, {}, res, jest.fn());
    // THEN
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur serveur' });
    expect(logger.error).toHaveBeenCalled();
  });
  it('Erreur >= 500', () => {
    // GIVEN
    const err = new AppError('Service externe KO', 503);
    const res = mockRes();
    // WHEN
    errorHandler(err, {}, res, jest.fn());
    // THEN
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur serveur' });
    expect(logger.error).toHaveBeenCalled();
  });
});
