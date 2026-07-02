import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';
import {
  validateJsonResponse,
  validateUser,
} from '../../../utils/validators';
import user from '../../../fixtures/api/user.json';

test('Deve criar um novo usuário', async ({ request }) => {
  const api = new ApiClient(request);

  const response = await api.createUser(user);

  await validateJsonResponse(response, 201);

  const body = await response.json();

  validateUser(body);

  expect(body.name).toBe(user.name);
  expect(body.username).toBe(user.username);
  expect(body.email).toBe(user.email);
});