export class Token {
  constructor (
    private readonly token: string,
    private readonly expiresAt: Date
  ) {}

  public getToken (): string {
    return this.token
  }

  public getExpiresAt (): Date {
    return this.expiresAt
  }
}
