import { type LoginUser as ILoginUser } from '../protocols/login-user.js'
import { type UserLoginDto } from '../dtos/user-login.dto.js'
import { type UserLoginResultDto } from '../dtos/user-login-result.dto.js'

export class LoginUser implements ILoginUser {
  async login (user: UserLoginDto): Promise<UserLoginResultDto> {
    return {
      token: 'token'
    }
  }
}
