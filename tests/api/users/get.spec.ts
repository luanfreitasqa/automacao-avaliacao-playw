import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../utils/apiClient';
import {
    validateJsonResponse,
    validateUser,
} from '../../../utils/validators';

test('Deve buscar um usuário existente', async ({ request }) => {
    const api = new ApiClient(request);

    const response = await api.getUser(1);

    await validateJsonResponse(response, 200);

    const body = await response.json();

    validateUser(body);

    expect(body.id).toBe(1);
});