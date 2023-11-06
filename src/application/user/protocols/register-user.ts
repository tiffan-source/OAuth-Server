import { type UserResultDto } from '../dtos/user-result.dto'
import { type UserRegisterDto } from '../dtos/user-register.dto'

export interface RegisterUser {
  register: (user: UserRegisterDto) => Promise<UserResultDto>
}
