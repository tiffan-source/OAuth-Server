import { type CreateUserRepositoryParams } from '@data/protocols/user/create-user.repository'
import { faker } from '@faker-js/faker'

export const mockCreateUserParams = (): CreateUserRepositoryParams => ({
  name: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password()
})
