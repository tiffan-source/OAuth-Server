import { type UserResultDto } from '../dtos/user-result.dto.js'
import { type UserRegisterDto } from '../dtos/user-register.dto.js'

export interface RegisterUser {
  register: (user: UserRegisterDto) => Promise<UserResultDto>
}
