import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';
import {
  validateJsonResponse,
  validateUser,
} from '../../../utils/validators';
import { UserFactory } from '../../../fixtures/factories/UserFactory';
import { User } from '../../../models/User';

const scenarios: {
  name: string;
  buildUser: () => Partial<User>;
  expectedStatus: number;
}[] = [
  {
    name: 'payload completo e válido',
    buildUser: () => UserFactory.create(),
    expectedStatus: 201,
  },
  {
    // Nota: o JSONPlaceholder é uma API fake que não valida nem persiste dados,
    // por isso retorna 201 mesmo sem campos obrigatórios. Numa API real com
    // validação de fato, o esperado aqui seria 400 Bad Request.
    name: 'payload sem username',
    buildUser: () => {
      const { username, ...rest } = UserFactory.create();
      return rest;
    },
    expectedStatus: 201,
  },
  {
    name: 'payload com email em formato inválido',
    buildUser: () => UserFactory.create({ email: 'email-invalido' }),
    expectedStatus: 201, // idem nota acima
  },
];

test.describe('POST /users', () => {
  scenarios.forEach(({ name, buildUser, expectedStatus }) => {
    test(`Deve retornar ${expectedStatus} ao criar usuário com ${name}`, async ({
      request,
    }) => {
      const api = new ApiClient(request);
      const user = buildUser();

      const response = await api.createUser(user as User);

      await validateJsonResponse(response, expectedStatus);

      const body = await response.json();

      if (expectedStatus === 201) {
        expect(body.id).toBeTruthy();

        if (user.name) expect(body.name).toBe(user.name);
        if (user.username) expect(body.username).toBe(user.username);
        if (user.email) expect(body.email).toBe(user.email);
      }
    });
  });
});
