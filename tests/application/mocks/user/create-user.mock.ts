import { type CreateUserRepository, type CreateUserRepositoryParams, type CreateUserRepositoryResult } from '@data/protocols/user/create-user.repository'
import { User } from '@domain/user/entity/user'

export class CreateUserMock implements CreateUserRepository {
  async create (user: CreateUserRepositoryParams): Promise<CreateUserRepositoryResult> {
    const newuser = new User('123', user.name, user.email, user.password)
    return newuser
  }
}
