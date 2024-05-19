import { type GetAuthorizationCodeWithClientAndUserRepository, type GetAuthorizationCodeWithClientAndUserRepositoryResult } from '@data/protocols/auth/get-authorization-code-with-client-and-user.repository.js'
import { Client } from '@domain/auth/entity/client.js'
import { OAuthModel } from '@infrastructure/oauth2-server/oauth-models.js'
import { AuthorizationCode } from '@domain/auth/entity/authorization-code.js'
import { jest } from '@jest/globals'
import { type GetClientByClientIdRepository } from '@data/protocols/auth/get-client-by-clientid.repository.js'
import { type GetClientByClientIdAndClientSecretRepository } from '@data/protocols/auth/get-client-by-clientid-and-clientSecret.repository.js'
import { type CreateAuthorizationCodeRepository, type CreateAuthorizationCodeRepositoryParams, type CreateAuthorizationCodeRepositoryResult } from '@data/protocols/auth/create-authorization-code.repository.js'
import { User } from '@domain/user/entity/user.js'
import { type DeleteAuthorizationCodeRepository } from '@data/protocols/auth/delete-authorization-code.repository.js'

describe('OAuthModel', () => {
  const getClientByClientIdRepository: jest.Mocked<GetClientByClientIdRepository> = {
    getClientById: jest.fn<(clientId: string) => Promise<Client | null>>()
  }

  const getAuthorizationCodeWithClientAndUserRepository: jest.Mocked<GetAuthorizationCodeWithClientAndUserRepository> = {
    getAuthorizationCode: jest.fn<(authorizationCode: string) => Promise<GetAuthorizationCodeWithClientAndUserRepositoryResult>>()
  }

  const getClientByClientIdAndClientSecretRepository: jest.Mocked<GetClientByClientIdAndClientSecretRepository> = {
    getClientByClientIdAndClientSecret: jest.fn<(clientId: string, clientSecret: string) => Promise<Client | null>>()
  }

  const createAuthorizationCodeRepository: jest.Mocked<CreateAuthorizationCodeRepository> = {
    createAuthorizationCode: jest.fn<(authCodeParams: CreateAuthorizationCodeRepositoryParams) => Promise<CreateAuthorizationCodeRepositoryResult>>()
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

  it('should implement AuthorizationCodeModel', () => {
    expect(oauthModel).toHaveProperty('getClient')
    expect(oauthModel).toHaveProperty('saveAuthorizationCode')
    expect(oauthModel).toHaveProperty('getAuthorizationCode')
    expect(oauthModel).toHaveProperty('revokeAuthorizationCode')
    expect(oauthModel).toHaveProperty('saveToken')
    expect(oauthModel).toHaveProperty('getAccessToken')
  })

  it('should get client with expected field if client found', async () => {
    const client = new Client('clientId', 'clientSecret', ['redirectUri'], ['scope'], ['Authorization Code'])

    getClientByClientIdAndClientSecretRepository.getClientByClientIdAndClientSecret.mockResolvedValue(client)

    const result = await oauthModel.getClient('clientId', 'clientSecret')

    expect(getClientByClientIdAndClientSecretRepository.getClientByClientIdAndClientSecret).toHaveBeenCalledWith('clientId', 'clientSecret')

    if (result instanceof Object) {
      expect(result.id).toEqual('clientId')
      expect(result.redirectUris).toEqual(['redirectUri'])
      expect(result.grants).toEqual(['authorization_code'])
    } else {
      expect(true).toBeFalsy()
    }
  })

  it('should get client using just clientId', async () => {
    const client = new Client('clientId', 'clientSecret', ['redirectUri'], ['scope'], ['Authorization Code'])

    getClientByClientIdRepository.getClientById.mockResolvedValue(client)

    const result = await oauthModel.getClient('clientId', null)

    expect(getClientByClientIdRepository.getClientById).toHaveBeenCalledWith('clientId')

    if (result instanceof Object) {
      expect(result.id).toEqual('clientId')
      expect(result.redirectUris).toEqual(['redirectUri'])
      expect(result.grants).toEqual(['authorization_code'])
    } else {
      expect(true).toBeFalsy()
    }
  })

  it('should return falsey if client not found', async () => {
    getClientByClientIdAndClientSecretRepository.getClientByClientIdAndClientSecret.mockResolvedValue(null)

    const result = await oauthModel.getClient('clientId not found', 'clientSecret')

    expect(getClientByClientIdAndClientSecretRepository.getClientByClientIdAndClientSecret).toHaveBeenCalledWith('clientId not found', 'clientSecret')

    expect(result).toBeFalsy()
  })

  it('should save authorization code and return expected field of data saving', async () => {
    const date = new Date()

    const authCodeParams = {
      code: 'authorizationCode',
      expiresAt: date,
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      userId: 'userId',
      scope: ['scope'],
      codeChallenge: 'codeChallenge',
      codeChallengeMethod: 'codeChallengeMethod'
    }

    const resultCode = new AuthorizationCode('authorizationCode', date, 'redirectUri')

    createAuthorizationCodeRepository.createAuthorizationCode.mockResolvedValue(resultCode)

    const code = await oauthModel.saveAuthorizationCode(
      {
        authorizationCode: 'authorizationCode',
        expiresAt: date,
        redirectUri: 'redirectUri',
        scope: ['scope'],
        codeChallenge: 'codeChallenge',
        codeChallengeMethod: 'codeChallengeMethod'
      },
      {
        id: 'clientId',
        redirectUris: ['redirectUri'],
        grants: ['authorization_code']
      },
      {
        id: 'userId'
      }
    )

    expect(createAuthorizationCodeRepository.createAuthorizationCode).toHaveBeenCalledWith(authCodeParams)

    expect(code).toBeTruthy()
    if (code instanceof Object) {
      expect(code.authorizationCode).toEqual('authorizationCode')
      expect(code.expiresAt).toEqual(date)
      expect(code.redirectUri).toEqual('redirectUri')
      expect(code.scope).toEqual(['scope'])
      expect(code.client).toEqual({
        id: 'clientId',
        grants: ['authorization_code'],
        redirectUris: ['redirectUri']
      })
      expect(code.user).toEqual({ id: 'userId' })
    } else {
      expect(true).toBeFalsy()
    }
  })

  it('should save authorization code and return [] for scope if not provided', async () => {
    const date = new Date()

    const client = new Client('clientId', 'clientSecret', ['redirectUri'], ['scope'], ['Authorization Code'])
    getClientByClientIdRepository.getClientById.mockResolvedValue(client)

    const authCodeParams = {
      code: 'authorizationCode',
      expiresAt: date,
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      userId: 'userId',
      scope: [],
      codeChallenge: 'codeChallenge',
      codeChallengeMethod: 'codeChallengeMethod'
    }

    const resultCode = new AuthorizationCode('authorizationCode', date, 'redirectUri')

    createAuthorizationCodeRepository.createAuthorizationCode.mockResolvedValue(resultCode)

    const code = await oauthModel.saveAuthorizationCode(
      {
        authorizationCode: 'authorizationCode',
        expiresAt: date,
        redirectUri: 'redirectUri',
        codeChallenge: 'codeChallenge',
        codeChallengeMethod: 'codeChallengeMethod'
      },
      {
        id: 'clientId',
        redirectUris: ['redirectUri'],
        grants: ['authorization_code']
      },
      {
        id: 'userId'
      }
    )

    expect(createAuthorizationCodeRepository.createAuthorizationCode).toHaveBeenCalledWith(authCodeParams)

    expect(code).toBeTruthy()
    if (code instanceof Object) {
      expect(code.authorizationCode).toEqual('authorizationCode')
      expect(code.expiresAt).toEqual(date)
      expect(code.redirectUri).toEqual('redirectUri')
      expect(code.scope).toEqual([])
      expect(code.client).toEqual({
        id: 'clientId',
        grants: ['authorization_code'],
        redirectUris: ['redirectUri']
      })
      expect(code.user).toEqual({ id: 'userId' })
    } else {
      expect(true).toBeFalsy()
    }
  })

  it('should save authorization code without non require field and return expected field of data saving', async () => {
    const date = new Date()

    const client = new Client('clientId', 'clientSecret', ['redirectUri'], ['scope'], ['Authorization Code'])
    getClientByClientIdRepository.getClientById.mockResolvedValue(client)

    const authCodeParams = {
      code: 'authorizationCode',
      expiresAt: date,
      redirectUri: 'redirectUri',
      clientId: 'clientId',
      userId: 'userId',
      scope: []
    }

    const resultCode = new AuthorizationCode('authorizationCode', date, 'redirectUri')

    createAuthorizationCodeRepository.createAuthorizationCode.mockResolvedValue(resultCode)

    const code = await oauthModel.saveAuthorizationCode(
      {
        authorizationCode: 'authorizationCode',
        expiresAt: date,
        redirectUri: 'redirectUri'
      },
      {
        id: 'clientId',
        redirectUris: ['redirectUri'],
        grants: ['authorization_code']
      },
      {
        id: 'userId'
      }
    )

    expect(createAuthorizationCodeRepository.createAuthorizationCode).toHaveBeenCalledWith(authCodeParams)

    expect(code).toBeTruthy()
    if (code instanceof Object) {
      expect(code.authorizationCode).toEqual('authorizationCode')
      expect(code.expiresAt).toEqual(date)
      expect(code.redirectUri).toEqual('redirectUri')
      expect(code.scope).toEqual([])
      expect(code.client).toEqual({
        id: 'clientId',
        grants: ['authorization_code'],
        redirectUris: ['redirectUri']
      })
      expect(code.user).toEqual({ id: 'userId' })
    } else {
      expect(true).toBeFalsy()
    }
  })

  it('should get authorization code with expected field return when using save authorization code', async () => {
    const date = new Date()

    const resultCode = new AuthorizationCode('authorizationCode', date, 'redirectUri')

    createAuthorizationCodeRepository.createAuthorizationCode.mockResolvedValue(resultCode)

    const resultGetCode = {
      authCode: resultCode,
      client: new Client('clientId', 'clientSecret', ['redirectUri'], ['scope'], ['authorization_code']),
      user: new User('userId', 'username', 'any@gmail.com', 'password')
    }

    getAuthorizationCodeWithClientAndUserRepository.getAuthorizationCode.mockResolvedValue(resultGetCode)

    const code = await oauthModel.saveAuthorizationCode(
      {
        authorizationCode: 'authorizationCode',
        expiresAt: date,
        redirectUri: 'redirectUri'
      },
      {
        id: 'clientId',
        redirectUris: ['redirectUri'],
        grants: ['authorization_code']
      },
      {
        id: 'userId'
      }
    )

    const saveCode = await oauthModel.getAuthorizationCode('authorizationCode')

    expect(saveCode).toBeTruthy()

    if (saveCode instanceof Object && code instanceof Object) {
      expect(saveCode.authorizationCode).toEqual(code.authorizationCode)
      expect(saveCode.expiresAt).toEqual(code.expiresAt)
      expect(saveCode.redirectUri).toEqual(code.redirectUri)
      expect(saveCode.client).toEqual({
        id: 'clientId',
        grants: ['authorization_code'],
        redirectUris: ['redirectUri']
      })
      expect(saveCode.user).toEqual({ id: 'userId' })
    } else {
      expect(true).toBeFalsy()
    }
  })

  it('should return falsey if authorization code not found', async () => {
    getAuthorizationCodeWithClientAndUserRepository.getAuthorizationCode.mockResolvedValue(null)

    const codeResult = await oauthModel.getAuthorizationCode('notfondAuthorizationCode')

    expect(codeResult).toBeFalsy()
  })

  it('should revoke authorization code and return true if success', async () => {
    getAuthorizationCodeWithClientAndUserRepository.getAuthorizationCode.mockResolvedValue({
      authCode: new AuthorizationCode('authorizationCode', new Date(), 'redirectUri'),
      client: new Client('clientId', 'clientSecret', ['redirectUri'], ['scope'], ['authorization_code']),
      user: new User('userId', 'username', 'email', 'password')
    })

    const result = await oauthModel.revokeAuthorizationCode(
      {
        authorizationCode: 'authorizationCode',
        expiresAt: new Date(),
        redirectUri: 'redirectUri',
        scope: ['scope'],
        client: {
          id: 'clientId',
          redirectUris: ['redirectUri'],
          grants: ['authorization_code']
        },
        user: {
          id: 'userId'
        }
      }
    )

    expect(getAuthorizationCodeWithClientAndUserRepository.getAuthorizationCode).toHaveBeenCalledWith('authorizationCode')
    expect(deleteAuthorizationCodeRepository.deleteAuthorizationCode).toHaveBeenCalledWith('authorizationCode')
    expect(result).toBeTruthy()
  })

  it('should revoke authorization code and return false if failed', async () => {
    getAuthorizationCodeWithClientAndUserRepository.getAuthorizationCode.mockResolvedValue(null)

    const result = await oauthModel.revokeAuthorizationCode({
      authorizationCode: 'authorizationCodeNotfound',
      expiresAt: new Date(),
      redirectUri: 'redirectUri',
      scope: ['scope'],
      client: {
        id: 'clientId',
        redirectUris: ['redirectUri'],
        grants: ['authorization_code']
      },
      user: {
        id: 'userId'
      }
    })

    expect(getAuthorizationCodeWithClientAndUserRepository.getAuthorizationCode).toHaveBeenCalledWith('authorizationCodeNotfound')
    expect(result).toBeFalsy()
  })
})
