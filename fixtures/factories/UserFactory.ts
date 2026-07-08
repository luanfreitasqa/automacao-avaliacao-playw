import { faker } from '@faker-js/faker';
import { User } from '../../models/User';

export class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      ...overrides,
    };
  }
}
