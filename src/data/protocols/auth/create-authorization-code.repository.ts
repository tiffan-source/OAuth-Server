import { type AuthorizationCode } from '@domain/auth/entity/authorization-code'

export interface CreateAuthorizationCodeRepository {
  createAuthorizationCode: (authCodeParams: CreateAuthorizationCodeRepositoryParams) => Promise<CreateAuthorizationCodeRepositoryResult>
}

export interface CreateAuthorizationCodeRepositoryParams {
  code: string
  expiresAt: Date
  redirectUri: string
  clientId: string
  userId: string
  scope?: string[]
  codeChallenge?: string
  codeChallengeMethod?: string
}

export type CreateAuthorizationCodeRepositoryResult = AuthorizationCode
