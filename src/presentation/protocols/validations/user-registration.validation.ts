import { type HttpUserRegister } from '../controllers/request/user/httpUserRegister'
import { type IValidation } from './validation'

export interface UserRegisterValidation extends IValidation {
  validate: (input: HttpUserRegister) => Promise<void>
}
