import { faker } from '@faker-js/faker';

export interface CheckoutData {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutFactory {
  static create(): CheckoutData {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode('########'),
    };
  }
}