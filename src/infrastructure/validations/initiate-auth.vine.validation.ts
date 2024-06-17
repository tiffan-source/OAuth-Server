import { type HttpAuthInitiate } from '@presentation/protocols/controllers/request/auth/httpAuthInitiate.js'
import { type AuthValidation } from '@presentation/protocols/validations/auth.validation.js'
import { ValidationError } from '@presentation/protocols/validations/validation-error.js'
import { Validation } from '@presentation/validations/validation.js'
import vine, { errors } from '@vinejs/vine'
import { injectable } from 'inversify'

@injectable()
export class InitiateAuthVineValidation extends Validation implements AuthValidation {
  async validate (auth: HttpAuthInitiate): Promise<void> {
    this.validationErrors = []
    try {
      const schema = vine.object({
        clientId: vine.string().minLength(3).maxLength(50),
        redirectUri: vine.string().url(),
        responseType: vine.string()
      })
      await vine.compile(schema).validate(auth.query)
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        for (const err of error.messages) {
          this.validationErrors.push(new ValidationError(err.rule, err.field, err.message))
        }
      }
    }
  }
}
