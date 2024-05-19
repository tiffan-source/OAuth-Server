export class AuthorizationCode {
  constructor (
    private readonly authorizationCode: string,
    private readonly expiresAt: Date,
    private readonly redirectUri: string,
    private readonly scope?: string[],
    private readonly codeChallenge?: string,
    private readonly codeChallengeMethod?: string
  ) {}

  public getAuthorizationCode (): string {
    return this.authorizationCode
  }

  public getExpiresAt (): Date {
    return this.expiresAt
  }

  public getRedirectUri (): string {
    return this.redirectUri
  }

  public getCodeChallenge (): string | undefined {
    return this.codeChallenge
  }

  public getCodeChallengeMethod (): string | undefined {
    return this.codeChallengeMethod
  }

  public getScope (): string[] | undefined {
    return this.scope
  }
}
