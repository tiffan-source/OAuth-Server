import { type CreateAuthorizationCodeRepository } from '@data/protocols/auth/create-authorization-code.repository.js'
import { type DeleteAuthorizationCodeRepository } from '@data/protocols/auth/delete-authorization-code.repository.js'
import { type GetAuthorizationCodeWithClientAndUserRepository } from '@data/protocols/auth/get-authorization-code-with-client-and-user.repository.js'
import { type GetClientByClientIdAndClientSecretRepository } from '@data/protocols/auth/get-client-by-clientid-and-clientSecret.repository.js'
import { type GetClientByClientIdRepository } from '@data/protocols/auth/get-client-by-clientid.repository.js'
import { type AuthorizationCodeModel, type AuthorizationCode, type Client, type Falsey, type Token, type User } from '@node-oauth/oauth2-server'

export class OAuthModel implements AuthorizationCodeModel {
  private readonly getClientByClientIdRepository: GetClientByClientIdRepository
  private readonly getAuthorizationCodeRepository: GetAuthorizationCodeWithClientAndUserRepository
  private readonly getClientByClientIdAndClientSecretRepository: GetClientByClientIdAndClientSecretRepository
  private readonly createAuthorizationCodeRepository: CreateAuthorizationCodeRepository
  private readonly deleteAuthorizationCodeRepository: DeleteAuthorizationCodeRepository

  constructor (
    getClientByClientIdRepository: GetClientByClientIdRepository,
    getAuthorizationCodeRepository: GetAuthorizationCodeWithClientAndUserRepository,
    getClientByClientIdAndClientSecretRepository: GetClientByClientIdAndClientSecretRepository,
    createAuthorizationCodeRepository: CreateAuthorizationCodeRepository,
    deleteAuthorizationCodeRepository: DeleteAuthorizationCodeRepository
  ) {
    this.getClientByClientIdRepository = getClientByClientIdRepository
    this.getAuthorizationCodeRepository = getAuthorizationCodeRepository
    this.getClientByClientIdAndClientSecretRepository = getClientByClientIdAndClientSecretRepository
    this.createAuthorizationCodeRepository = createAuthorizationCodeRepository
    this.deleteAuthorizationCodeRepository = deleteAuthorizationCodeRepository
  }

  async getClient (clientId: string, clientSecret: string | null): Promise<Falsey | Client> {
    let result

    if (clientSecret !== null) {
      result = await this.getClientByClientIdAndClientSecretRepository.getClientByClientIdAndClientSecret(clientId, clientSecret)
    } else {
      result = await this.getClientByClientIdRepository.getClientById(clientId)
    }

    if (result === null) {
      return result
    }

    return {
      id: result.getId(),
      grants: result.getGrants(),
      redirectUris: result.getRedirectUri()
    }
  }

  async saveAuthorizationCode (
    code: Pick<AuthorizationCode, 'authorizationCode' | 'expiresAt' | 'redirectUri' | 'scope' | 'codeChallenge' | 'codeChallengeMethod'>,
    client: Client,
    user: User): Promise<AuthorizationCode | Falsey> {
    const clientResult = await this.getClientByClientIdRepository.getClientById(client.id)

    if (clientResult === null) {
      return clientResult
    }

    const authCode = await this.createAuthorizationCodeRepository.createAuthorizationCode({
      code: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      clientId: client.id,
      userId: user.id,
      codeChallenge: code.codeChallenge,
      codeChallengeMethod: code.codeChallengeMethod
    })

    return {
      authorizationCode: authCode.getAuthorizationCode(),
      expiresAt: authCode.getExpiresAt(),
      redirectUri: authCode.getRedirectUri(),
      codeChallenge: authCode.getCodeChallenge(),
      codeChallengeMethod: authCode.getCodeChallengeMethod(),
      scope: code.scope,
      client: {
        id: clientResult.getId(),
        grants: clientResult.getGrants(),
        redirectUris: clientResult.getRedirectUri()
      },
      user: { id: user.id }
    }
  }

  async getAuthorizationCode (authorizationCode: string): Promise<AuthorizationCode | Falsey> {
    const authCode = await this.getAuthorizationCodeRepository.getAuthorizationCode(authorizationCode)

    if (authCode === null) {
      return authCode
    }

    const { authCode: authCodeResult, client, user } = authCode

    return {
      authorizationCode: authCodeResult.getAuthorizationCode(),
      expiresAt: authCodeResult.getExpiresAt(),
      redirectUri: authCodeResult.getRedirectUri(),
      codeChallenge: authCodeResult.getCodeChallenge(),
      codeChallengeMethod: authCodeResult.getCodeChallengeMethod(),
      client: {
        id: client.getId(),
        grants: client.getGrants(),
        redirectUris: client.getRedirectUri()
      },
      user: { id: user.getId() }
    }
  }

  async revokeAuthorizationCode (code: AuthorizationCode): Promise<boolean> {
    const checkCode = await this.getAuthorizationCodeRepository.getAuthorizationCode(code.authorizationCode)

    if (checkCode === null) {
      return false
    }

    await this.deleteAuthorizationCodeRepository.deleteAuthorizationCode(code.authorizationCode)

    return true
  }

  async saveToken (token: Token, client: Client, user: User): Promise<Falsey | Token> {
    throw new Error('Method not implemented.')
  }

  async getAccessToken (accessToken: string): Promise<Falsey | Token> {
    throw new Error('Method not implemented.')
  }
}
