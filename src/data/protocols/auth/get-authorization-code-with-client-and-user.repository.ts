import { type AuthorizationCode } from '@domain/auth/entity/authorization-code.js'
import { type Client } from '@domain/auth/entity/client.js'
import { type User } from '@domain/user/entity/user.js'

export interface GetAuthorizationCodeWithClientAndUserRepository {
  getAuthorizationCode: (code: GetAuthorizationCodeWithClientAndUserRepositoryParams) => Promise<GetAuthorizationCodeWithClientAndUserRepositoryResult>
}

export type GetAuthorizationCodeWithClientAndUserRepositoryParams = string

export type GetAuthorizationCodeWithClientAndUserRepositoryResult = {
  authCode: AuthorizationCode
  client: Client
  user: User
} | null
