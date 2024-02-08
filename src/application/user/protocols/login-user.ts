import { type UserLoginDto } from '../dtos/user-login.dto.js'

export interface LoginUser {
  login: (user: UserLoginDto) => Promise<UserLoginResultDto>
}
