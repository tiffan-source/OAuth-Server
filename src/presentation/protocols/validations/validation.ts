import { type ValidationError } from './validation-error'

export interface IValidation {
  validate: (input: any) => void
  getErrors: () => ValidationError[]
  isValid: () => boolean
}
