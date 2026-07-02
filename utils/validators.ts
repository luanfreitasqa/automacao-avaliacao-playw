import { APIResponse, expect } from '@playwright/test';
import { User } from '../models/User';

export async function validateJsonResponse(
    response: APIResponse,
    expectedStatus: number
): Promise<void> {
    expect(response.status()).toBe(expectedStatus);

    expect(response.headers()['content-type']).toContain('application/json');
}

export function validateUser(user: User): void {
    expect(user.id).toBeTruthy();
    expect(user.name).toBeTruthy();
    expect(user.email).toContain('@');
}