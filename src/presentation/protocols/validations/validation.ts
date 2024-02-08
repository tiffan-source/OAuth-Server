import { type ValidationError } from './validation-error'

export interface IValidation {
  validate: (input: any) => Promise<void>
  getErrors: () => ValidationError[]
  isValid: () => boolean
}
