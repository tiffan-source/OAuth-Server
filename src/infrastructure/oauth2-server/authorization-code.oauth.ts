import { type AuthorizationCodeRepository, type AuthorizationCodeRepositoryParams } from '@data/protocols/auth/authorization-code.repository'
import { AuthorizationCode } from '@domain/auth/entity/authorization-code'
import { type OAuthServer } from './oauth-server'
import { Request, Response } from '@node-oauth/oauth2-server'

// Not yet tested
export class AuthorizationCodeOAuth implements AuthorizationCodeRepository {
  private readonly oauth2Server

  constructor (
    oauthServer: OAuthServer
  ) {
    this.oauth2Server = oauthServer
  }

  async authorizationCode (authRequest: AuthorizationCodeRepositoryParams): Promise<AuthorizationCode> {
    const { clientId, redirectUri, state, codeChallenge, codeChallengeMethod, scope, nonce } = authRequest

    const request = new Request({
      method: 'GET',
      query: {
        client_id: clientId,
        state,
        scope,
        redirect_uri: redirectUri,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod,
        nonce
      },
      headers: {}
    })

    const response = new Response()

    const code = await this.oauth2Server.getOAuth2Server().authorize(request, response)

    const authCode = new AuthorizationCode(code.authorizationCode, code.expiresAt, code.redirectUri, code.scope, code.codeChallenge, code.codeChallengeMethod)

    return authCode
  };
}
