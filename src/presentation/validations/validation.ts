import { type ValidationError } from '@presentation/protocols/validations/validation-error'
import { type IValidation } from '@presentation/protocols/validations/validation.js'
import { injectable } from 'inversify'

@injectable()
export class Validation implements IValidation {
  protected validationErrors: ValidationError[] = []

  async validate (input: any): Promise<void> {};

  getErrors (): ValidationError[] {
    return this.validationErrors
  }

  isValid (): boolean {
    return this.validationErrors.length === 0
  }
}
