import { APIRequestContext, APIResponse } from '@playwright/test';
import { User } from '../models/User';

export class ApiClient {
  constructor(private request: APIRequestContext) { }

  async getUser(id: number | string): Promise<APIResponse> {
    return this.request.get(`/users/${id}`);
  }

  async createUser(user: User): Promise<APIResponse> {
    return this.request.post('/users', {
      data: user,
    });
  }

  async updateUser(id: number, user: User): Promise<APIResponse> {
    return this.request.put(`/users/${id}`, {
      data: user,
    });
  }

  async deleteUser(id: number): Promise<APIResponse> {
    return this.request.delete(`/users/${id}`);
  }
}