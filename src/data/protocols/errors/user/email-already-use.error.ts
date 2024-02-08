export class EmailAlreadyUseError extends Error {
  constructor () {
    super()
    this.name = 'EmailAlreadyUseError'
    Object.setPrototypeOf(this, EmailAlreadyUseError.prototype)
  }
}
