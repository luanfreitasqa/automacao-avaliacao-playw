import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';
import { validateJsonResponse } from '../../../utils/validators';
import { UserFactory } from '../../../fixtures/factories/UserFactory';

const scenarios: {
  name: string;
  id: number;
  expectedStatus: number;
  shouldValidateUser: boolean;
}[] = [
  {
    name: 'usuário existente',
    id: 1,
    expectedStatus: 200,
    shouldValidateUser: true,
  },
  {
    // Confirmado rodando contra a API real: o JSONPlaceholder retorna 500 ao
    // tentar atualizar um id inexistente (diferente do que uma leitura da
    // documentação sugeriria). Numa API real de verdade, o esperado seria 404 -
    // o importante aqui é que o comportamento está documentado e testado, não
    // "assumido".
    name: 'usuário inexistente',
    id: 999999,
    expectedStatus: 500,
    shouldValidateUser: false,
  },
];

test.describe('PUT /users/:id', () => {
  scenarios.forEach(({ name, id, expectedStatus, shouldValidateUser }) => {
    test(`Deve retornar ${expectedStatus} ao atualizar ${name}`, async ({
      request,
    }) => {
      const api = new ApiClient(request);
      const user = UserFactory.create();

      const response = await api.updateUser(id, user);

      if (shouldValidateUser) {
        await validateJsonResponse(response, expectedStatus);

        const body = await response.json();

        expect(body.name).toBe(user.name);
        expect(body.username).toBe(user.username);
        expect(body.email).toBe(user.email);
      } else {
        expect(response.status()).toBe(expectedStatus);
      }
    });
  });
});
