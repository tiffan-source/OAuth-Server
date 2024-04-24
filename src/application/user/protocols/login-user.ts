import { type UserLoginResultDto } from '@application/user/dtos/user-login-result.dto.js'
import { type UserLoginDto } from '../dtos/user-login.dto'
export interface LoginUser {
  login: (user: UserLoginDto) => Promise<UserLoginResultDto>
}
