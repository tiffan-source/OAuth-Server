export class Client {
  constructor (
    private readonly id: string,
    private readonly secret: string,
    private readonly redirectUri: string[],
    private readonly scope: string[],
    private readonly responsesTypes: string[]
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

  public getScope (): string[] {
    return this.scope
  }

  public getResponsesTypes (): string[] {
    return this.responsesTypes
  }
}
