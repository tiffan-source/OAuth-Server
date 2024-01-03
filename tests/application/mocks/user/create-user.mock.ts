import { type CreateUserRepository, type CreateUserRepositoryParams, type CreateUserRepositoryResult } from '@data/protocols/user/create-user.repository.js'
import { User } from '@domain/user/entity/user.js'

// Bad practice, because it is not testing the return of the method, but the implementation of the method.
export class CreateUserMock implements CreateUserRepository {
  async create (user: CreateUserRepositoryParams): Promise<CreateUserRepositoryResult> {
    const newuser = new User('123', user.name, user.email, user.password)
    return newuser
  }
}
