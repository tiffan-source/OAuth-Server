import { type AuthoriationCode } from '@domain/auth/entity/authorization-code.js'

export interface AuthorizationCodeRepository {
  authorizationCode: (request: AuthorizationCodeRepositoryParams) => Promise<AuthorizationCodeRepositoryResult>
};

export interface AuthorizationCodeRepositoryParams {
  clientId: string
  redirectUri: string
  state: string
  codeChallenge: string
  codeChallengeMethod: string
  scope: string[]
  nonce: string
  user: {
    id: string
  } | null
}

export type AuthorizationCodeRepositoryResult = AuthoriationCode
