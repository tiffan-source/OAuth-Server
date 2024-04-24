export class UserLoginIncorrectError extends Error {
  constructor () {
    super()
    this.name = 'UserLoginIncorrectError'
    this.message = 'The login information is incorrect'
    Object.setPrototypeOf(this, UserLoginIncorrectError.prototype)
  }
}
