import { type User } from '@domain/user/entity/user.js'

export interface FindUserByEmailRepository {
  findUserByEmail: (user: FindUserByEmailRepositoryParams) => Promise<FindUserByEmailRepositoryResult>
}

export type FindUserByEmailRepositoryParams = string

export type FindUserByEmailRepositoryResult = User | null
