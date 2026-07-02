import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';

test('Deve excluir um usuário', async ({ request }) => {
  const api = new ApiClient(request);

  const response = await api.deleteUser(1);

  expect(response.status()).toBe(200);

  expect(await response.text()).toBe('{}');
});