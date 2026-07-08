import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';

const scenarios: {
  name: string;
  id: number;
  expectedStatus: number;
}[] = [
  {
    name: 'usuário existente',
    id: 1,
    expectedStatus: 200,
  },
  {
    // Nota: mesma limitação do PUT - o JSONPlaceholder finge o sucesso mesmo
    // para ids inexistentes. Ajuste para 404 se validar contra uma API real.
    name: 'usuário inexistente',
    id: 999999,
    expectedStatus: 200,
  },
];

test.describe('DELETE /users/:id', () => {
  scenarios.forEach(({ name, id, expectedStatus }) => {
    test(`Deve retornar ${expectedStatus} ao excluir ${name}`, async ({
      request,
    }) => {
      const api = new ApiClient(request);

      const response = await api.deleteUser(id);

      expect(response.status()).toBe(expectedStatus);

      expect(await response.text()).toBe('{}');
    });
  });
});
