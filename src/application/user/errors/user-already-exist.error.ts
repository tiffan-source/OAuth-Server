export class UserAlreadyExistError extends Error {
  constructor () {
    super()
    this.name = 'UserAlreadyExistError'
    this.message = 'The user with email already exists'
    Object.setPrototypeOf(this, UserAlreadyExistError.prototype)
  }
}
