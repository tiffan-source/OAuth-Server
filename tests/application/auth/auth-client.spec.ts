import { type LoginUser } from '@application/user/protocols/login-user.js'
import { type AuthorizationCodeRepository, type AuthorizationCodeRepositoryParams, type AuthorizationCodeRepositoryResult } from '@data/protocols/auth/authorization-code.repository.js'
import { jest } from '@jest/globals'
import { type UserLoginResultDto } from '@application/user/dtos/user-login-result.dto.js'
import { type UserLoginDto } from '@application/user/dtos/user-login.dto.js'
import { AuthClient } from '@application/auth/use-cases/auth-client.js'
import { UserLoginIncorrectError } from '@application/auth/errors/user-login-incorrect.error.js'
import { AuthorizationCode } from '@domain/auth/entity/authorization-code.js'
import { type AuthClientDto } from '@application/auth/dtos/auth-client.dto.js'

describe('AuthClient', () => {
  const authorizationCodeRepositoryMock: jest.Mocked<AuthorizationCodeRepository> = {
    authorizationCode: jest.fn<(request: AuthorizationCodeRepositoryParams) => Promise<AuthorizationCodeRepositoryResult>>()
  }

  const loginUserMock: jest.Mocked<LoginUser> = {
    login: jest.fn<(user: UserLoginDto) => Promise<UserLoginResultDto>>()
  }

  const authParams: AuthClientDto = {
    client: {
      id: 'any_client_id',
      redirectUri: 'any_redirect_uri',
      responseType: 'any_response_type'
    },
    state: 'any_state',
    codeChallenge: 'any_codeChallenge',
    nonce: 'any_nonce',
    user: {
      email: 'any_email',
      password: 'any_password'
    },
    codeChallengeMethod: ''
  }

  it('should return data of type AuthClientResultDto', async () => {
    const authClient = new AuthClient(authorizationCodeRepositoryMock, loginUserMock)
    authorizationCodeRepositoryMock.authorizationCode.mockResolvedValue(new AuthorizationCode('any_code', new Date(), 'any_redirect_uri'))
    loginUserMock.login.mockResolvedValue({ user: { id: 'any_id' } })

    const result = await authClient.auth(authParams)

    expect(result).toHaveProperty('code')
    expect(result).toHaveProperty('state')
  })

  it('should call auth of AuthorizationCodeRepository', async () => {
    const authClient = new AuthClient(authorizationCodeRepositoryMock, loginUserMock)
    authorizationCodeRepositoryMock.authorizationCode.mockResolvedValue(new AuthorizationCode('any_code', new Date(), 'any_redirect_uri'))
    loginUserMock.login.mockResolvedValue({ user: { id: 'any_id' } })

    const verify = jest.spyOn(authorizationCodeRepositoryMock, 'authorizationCode')

    await authClient.auth(authParams)

    expect(verify).toHaveBeenCalled()
  })

  it('should call login of LoginUser', async () => {
    const authClient = new AuthClient(authorizationCodeRepositoryMock, loginUserMock)
    authorizationCodeRepositoryMock.authorizationCode.mockResolvedValue(new AuthorizationCode('any_code', new Date(), 'any_redirect_uri'))
    loginUserMock.login.mockResolvedValue({ user: { id: 'any_id' } })

    const verify = jest.spyOn(loginUserMock, 'login')

    await authClient.auth(authParams)

    expect(verify).toHaveBeenCalled()
  })

  it('should throw if auth throws', async () => {
    const authClient = new AuthClient(authorizationCodeRepositoryMock, loginUserMock)
    authorizationCodeRepositoryMock.authorizationCode.mockRejectedValue(new Error())

    await expect(authClient.auth(authParams)).rejects.toThrow()
  })

  it('should throw UserLoginIncorrect if login return null', async () => {
    const authClient = new AuthClient(authorizationCodeRepositoryMock, loginUserMock)
    loginUserMock.login.mockResolvedValue({ user: null })

    await expect(authClient.auth(authParams)).rejects.toThrow(UserLoginIncorrectError)
  })

  it('should return the same state', async () => {
    const authClient = new AuthClient(authorizationCodeRepositoryMock, loginUserMock)
    authorizationCodeRepositoryMock.authorizationCode.mockResolvedValue(new AuthorizationCode('any_code', new Date(), 'any_redirect_uri'))
    loginUserMock.login.mockResolvedValue({ user: { id: 'any_id' } })
    const result = await authClient.auth(authParams)

    expect(result.state).toBe(authParams.state)
  })
})
