export class UserRegisterDto {
  constructor (
    private readonly name: string,
    private readonly email: string,
    private readonly password: string
  ) { }

  getName (): string {
    return this.name
  }

  getEmail (): string {
    return this.email
  }

  getPassword (): string {
    return this.password
  }
}
