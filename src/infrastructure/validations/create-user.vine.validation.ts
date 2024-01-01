import { type HttpUserRegister } from '@presentation/protocols/controllers/request/user/httpUserRegister.js'
import { Validation } from '@presentation/validations/validation.js'
import { ValidationError } from '@presentation/protocols/validations/validation-error.js'
import vine, { errors } from '@vinejs/vine'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class CreateUserVineValidation extends Validation {
  async validate (user: HttpUserRegister): Promise<void> {
    try {
      const schema = vine.object({
        name: vine.string().minLength(3).maxLength(50),
        email: vine.string().email(),
        password: vine.string().minLength(6).maxLength(50)
      })
      await vine.compile(schema).validate(user.body)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        for (const err of error.messages) {
          this.validationErrors.push(new ValidationError(err.rule, err.field, err.message))
        }
      }
    }
  }
}
