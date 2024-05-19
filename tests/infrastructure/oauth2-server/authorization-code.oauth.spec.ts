import { type CreateAuthorizationCodeRepository, type CreateAuthorizationCodeRepositoryParams, type CreateAuthorizationCodeRepositoryResult } from '@data/protocols/auth/create-authorization-code.repository.js'
import { type DeleteAuthorizationCodeRepository } from '@data/protocols/auth/delete-authorization-code.repository.js'
import { type GetAuthorizationCodeWithClientAndUserRepository, type GetAuthorizationCodeWithClientAndUserRepositoryResult } from '@data/protocols/auth/get-authorization-code-with-client-and-user.repository.js'
import { type GetClientByClientIdAndClientSecretRepository } from '@data/protocols/auth/get-client-by-clientid-and-clientSecret.repository.js'
import { type GetClientByClientIdRepository } from '@data/protocols/auth/get-client-by-clientid.repository.js'
import { AuthorizationCode } from '@domain/auth/entity/authorization-code.js'
import { Client } from '@domain/auth/entity/client.js'
import { AuthorizationCodeOAuth } from '@infrastructure/oauth2-server/authorization-code.oauth.js'
import { OAuthModel } from '@infrastructure/oauth2-server/oauth-models.js'
import { OAuthServer } from '@infrastructure/oauth2-server/oauth-server.js'
import { jest } from '@jest/globals'

describe('AuthorizationCodeOAuth', () => {
  const getClientByClientIdRepository: jest.Mocked<GetClientByClientIdRepository> = {
    getClientById: jest.fn<(clientId: string) => Promise<Client | null>>()
      .mockResolvedValue(
        new Client('any_client_id', 'any_client_secret', ['http://localhost/'], ['scope'], ['Authorization Code'])
      )
  }

  const getAuthorizationCodeWithClientAndUserRepository: jest.Mocked<GetAuthorizationCodeWithClientAndUserRepository> = {
    getAuthorizationCode: jest.fn<(authorizationCode: string) => Promise<GetAuthorizationCodeWithClientAndUserRepositoryResult>>()
  }

  const getClientByClientIdAndClientSecretRepository: jest.Mocked<GetClientByClientIdAndClientSecretRepository> = {
    getClientByClientIdAndClientSecret: jest.fn<(clientId: string, clientSecret: string) => Promise<Client | null>>()
  }

  const createAuthorizationCodeRepository: jest.Mocked<CreateAuthorizationCodeRepository> = {
    createAuthorizationCode: jest.fn<(authCodeParams: CreateAuthorizationCodeRepositoryParams) => Promise<CreateAuthorizationCodeRepositoryResult>>()
      .mockResolvedValue(
        new AuthorizationCode(
          'any_code',
          new Date('2022-02-02'),
          'http://localhost/',
          ['scope'],
          'any_code_challenge',
          'S256'
        )
      )
  }

  const deleteAuthorizationCodeRepository: jest.Mocked<DeleteAuthorizationCodeRepository> = {
    deleteAuthorizationCode: jest.fn<(authorizationCode: string) => Promise<void>>()
  }

  const oauthModel = new OAuthModel(
    getClientByClientIdRepository,
    getAuthorizationCodeWithClientAndUserRepository,
    getClientByClientIdAndClientSecretRepository,
    createAuthorizationCodeRepository,
    deleteAuthorizationCodeRepository
  )

  const oauthServer = new OAuthServer(oauthModel)

  const authorizationCodeOAuth = new AuthorizationCodeOAuth(oauthServer)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return AuthorizationCode', async () => {
    const result = await authorizationCodeOAuth.authorizationCode({
      clientId: 'any_client_id',
      codeChallenge: 'any_code_challenge',
      codeChallengeMethod: 'S256',
      nonce: 'any_nonce',
      redirectUri: 'http://localhost/',
      scope: ['scope'],
      state: 'any_state',
      responseType: 'code',
      user: {
        id: 'any_user_id'
      }
    })

    expect(result).toBeInstanceOf(AuthorizationCode)
  })

  it('should call authorize', async () => {
    const authorizeSpy = jest.spyOn(oauthServer.getOAuth2Server(), 'authorize').mockResolvedValue('code')

    await authorizationCodeOAuth.authorizationCode({
      clientId: 'any_client_id',
      codeChallenge: 'any_code_challenge',
      codeChallengeMethod: 'any_code_challenge_method',
      nonce: 'any_nonce',
      redirectUri: 'http://localhost/',
      scope: ['scope'],
      state: 'any_state',
      responseType: 'code',
      user: {
        id: 'any_user_id'
      }
    })

    expect(authorizeSpy).toHaveBeenCalled()

    authorizeSpy.mockRestore()
  })

  it('should return AuthorizationCode with correct values', async () => {
    const authCode = await authorizationCodeOAuth.authorizationCode({
      clientId: 'any_client_id',
      codeChallenge: 'any_code_challenge',
      codeChallengeMethod: 'S256',
      nonce: 'any_nonce',
      redirectUri: 'http://localhost/',
      scope: ['scope'],
      state: 'any_state',
      responseType: 'code',
      user: {
        id: 'any_user_id'
      }
    })

    expect(authCode.getAuthorizationCode()).toBe('any_code')
    expect(authCode.getExpiresAt()).toEqual(new Date('2022-02-02'))
    expect(authCode.getScope()).toEqual(['scope'])
    expect(authCode.getRedirectUri()).toEqual('http://localhost/')
    expect(authCode.getCodeChallenge()).toEqual('any_code_challenge')
    expect(authCode.getCodeChallengeMethod()).toEqual('S256')
  })

  it('should return AuthorizationCode with correct values withou pkce', async () => {
    const authCode = await authorizationCodeOAuth.authorizationCode({
      clientId: 'any_client_id',
      // codeChallenge: 'any_code_challenge',
      // codeChallengeMethod: 'S256',
      nonce: 'any_nonce',
      redirectUri: 'http://localhost/',
      scope: ['scope'],
      state: 'any_state',
      responseType: 'code',
      user: {
        id: 'any_user_id'
      }
    })

    expect(authCode.getAuthorizationCode()).toBe('any_code')
    expect(authCode.getExpiresAt()).toEqual(new Date('2022-02-02'))
    expect(authCode.getScope()).toEqual(['scope'])
    expect(authCode.getRedirectUri()).toEqual('http://localhost/')
    expect(authCode.getCodeChallenge()).toEqual('any_code_challenge')
    expect(authCode.getCodeChallengeMethod()).toEqual('S256')
  })
})
