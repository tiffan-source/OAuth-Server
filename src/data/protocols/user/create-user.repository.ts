import { type User } from '@domain/user/entity/user'

export interface CreateUserRepository {
  create: (user: CreateUserRepositoryParams) => Promise<CreateUserRepositoryResult>
}

export interface CreateUserRepositoryParams {
  name: string
  email: string
  password: string
}

export type CreateUserRepositoryResult = User
