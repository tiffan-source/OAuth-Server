import { type AuthClientResultDto } from '@application/auth/dtos/auth-client-result.dto.js'
import { type AuthClientDto } from '@application/auth/dtos/auth-client.dto.js'
import { type AuthClient as IAuthClient } from '@application/auth/protocols/auth-client.js'
import { type AuthorizationCodeRepository } from '@data/protocols/auth/authorization-code.repository.js'
import { type LoginUser } from '@application/user/protocols/login-user.js'
import { UserLoginIncorrectError } from '../errors/user-login-incorrect.error'

export class AuthClient implements IAuthClient {
  private readonly authorizationCodeRepository: AuthorizationCodeRepository
  private readonly loginUser: LoginUser

  constructor (
    authorizationCodeRepository: AuthorizationCodeRepository,
    loginUser: LoginUser
  ) {
    this.authorizationCodeRepository = authorizationCodeRepository
    this.loginUser = loginUser
  }

  async auth (authClient: AuthClientDto): Promise<AuthClientResultDto> {
    const { client, state, codeChallenge, user, scope, nonce } = authClient

    const userLogin = await this.loginUser.login(user)

    if (userLogin.user === null) {
      throw new UserLoginIncorrectError()
    }

    try {
      const authCode = await this.authorizationCodeRepository.authorizationCode({
        clientId: client.id,
        redirectUri: client.redirectUri,
        state,
        codeChallenge,
        user: userLogin.user,
        scope,
        nonce
      })

      return {
        code: authCode.getAuthorizationCode(),
        state
      }
    } catch (error) {
      throw new Error()
    }
  }
}
