import { type AuthoriationCode } from '@domain/auth/entity/authorization-code.js'

export interface AuthorizationCodeRepository {
  authorizationCode: (request: AuthorizationCodeRepositoryParams) => Promise<AuthorizationCodeRepositoryResult>
};

export interface AuthorizationCodeRepositoryParams {
  clientId: string
  redirectUri: string
  state: string
  code_challenge: string
  user: {
    id: string
  } | null
}

export type AuthorizationCodeRepositoryResult = AuthoriationCode
