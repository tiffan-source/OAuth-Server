export class Client {
  constructor (
    private readonly id: string,
    private readonly secret: string,
    private readonly redirectUri: string[]
  ) {}

  public getId (): string {
    return this.id
  }

  public getSecret (): string {
    return this.secret
  }

  public getRedirectUri (): string[] {
    return this.redirectUri
  }
}
