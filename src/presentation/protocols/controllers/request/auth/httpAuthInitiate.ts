export interface HttpAuthInitiate {
  query: {
    clientId: string
    clientSecret?: string
    redirectUri: string
    scope?: string[]
    responseType: string
    codeChallenge?: string
    codeChallengeMethod?: string
  }
}
