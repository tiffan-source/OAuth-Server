import { type HttpAuthInitiate } from '../controllers/request/auth/httpAuthInitiate'
import { type IValidation } from './validation'

export interface AuthValidation extends IValidation {
  validate: (input: HttpAuthInitiate) => Promise<void>
}
