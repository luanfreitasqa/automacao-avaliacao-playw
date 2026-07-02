import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';
import {
  validateJsonResponse,
  validateUser,
} from '../../../utils/validators';
import user from '../../../fixtures/api/user.json';

test('Deve atualizar um usuário', async ({ request }) => {
  const api = new ApiClient(request);

  const response = await api.updateUser(1, user);

  await validateJsonResponse(response, 200);

  const body = await response.json();

  validateUser(body);

  expect(body.id).toBe(1);
  expect(body.name).toBe(user.name);
  expect(body.username).toBe(user.username);
  expect(body.email).toBe(user.email);
});