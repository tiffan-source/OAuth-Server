import { type AuthClientResultDto } from '@application/auth/dtos/auth-client-result.dto.js'
import { type AuthClientDto } from '@application/auth/dtos/auth-client.dto.js'
import { type AuthClient as IAuthClient } from '@application/auth/protocols/auth-client.js'
import { type AuthorizationCodeRepository } from '@data/protocols/auth/authorization-code.repository.js'
import { type LoginUser } from '@application/user/protocols/login-user.js'

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
    return {
      code: 'any_code',
      state: 'any_state'
    }
  }
}
