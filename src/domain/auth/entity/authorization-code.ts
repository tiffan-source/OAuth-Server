export class AuthoriationCode {
  constructor (
    private readonly authorizationCode: string,
    private readonly expiresAt: Date
  ) {}

  public getAuthorizationCode (): string {
    return this.authorizationCode
  }

  public getExpiresAt (): Date {
    return this.expiresAt
  }
}
