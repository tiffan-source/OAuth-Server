import { type User } from '@domain/user/entity/user.js'

export interface FindUserByEmailRepository {
  findUserByEmail: (user: FindUserByEmailRepositoryParams) => Promise<FindUserByEmailRepositoryResult>
}

export interface FindUserByEmailRepositoryParams {
  email: string
}

export interface FindUserByEmailRepositoryResult {
  user: User | null
}
