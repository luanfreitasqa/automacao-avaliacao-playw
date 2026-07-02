import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';

test('Deve retornar 404 ao buscar usuário inexistente', async ({ request }) => {
  const api = new ApiClient(request);

  const response = await api.getUser(999999);

  expect(response.status()).toBe(404);

  const body = await response.json();

  expect(body).toEqual({});
});