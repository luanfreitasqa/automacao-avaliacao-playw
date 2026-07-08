import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';
import {
  validateJsonResponse,
  validateUser,
} from '../../../utils/validators';

type ScenarioType = 'single' | 'notFound' | 'list';

const scenarios: {
  name: string;
  id: number | string;
  expectedStatus: number;
  type: ScenarioType;
}[] = [
  {
    name: 'usuário existente',
    id: 1,
    expectedStatus: 200,
    type: 'single',
  },
  {
    name: 'usuário inexistente',
    id: 999999,
    expectedStatus: 404,
    type: 'notFound',
  },
  {
    // Confirmado rodando contra a API real: json-server trata id não numérico
    // como "não encontrado" e retorna 404.
    name: 'id inválido (não numérico)',
    id: 'abc',
    expectedStatus: 404,
    type: 'notFound',
  },
  {
    // GET /users/ (sem id) equivale a GET /users -> lista completa, não é "not found"
    name: 'sem id informado (lista completa)',
    id: '',
    expectedStatus: 200,
    type: 'list',
  },
];

test.describe('GET /users/:id', () => {
  scenarios.forEach(({ name, id, expectedStatus, type }) => {
    test(`Deve retornar ${expectedStatus} ao buscar ${name}`, async ({
      request,
    }) => {
      const api = new ApiClient(request);

      const response = await api.getUser(id);

      expect(response.status()).toBe(expectedStatus);

      if (type === 'single') {
        await validateJsonResponse(response, expectedStatus);

        const body = await response.json();

        validateUser(body);

        expect(body.id).toBe(id);
      }

      if (type === 'notFound') {
        const body = await response.json();

        expect(body).toEqual({});
      }

      if (type === 'list') {
        await validateJsonResponse(response, expectedStatus);

        const body = await response.json();

        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
      }
    });
  });
});
