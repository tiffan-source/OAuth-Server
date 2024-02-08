import { type User } from '@domain/user/entity/user.js'

export interface GetUserRepository {
  getUser: (id: GetUserRepositoryParams) => Promise<GetUserRepository>
}

export type GetUserRepositoryParams = string

export type GetUserRepositoryResult = User
