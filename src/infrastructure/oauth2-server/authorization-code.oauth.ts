import { type AuthorizationCodeRepository, type AuthorizationCodeRepositoryParams } from '@data/protocols/auth/authorization-code.repository.js'
import { AuthorizationCode } from '@domain/auth/entity/authorization-code.js'
import { type OAuthServer } from '@infrastructure/oauth2-server/oauth-server.js'
import { Request, Response } from '@node-oauth/oauth2-server'

export class AuthorizationCodeOAuth implements AuthorizationCodeRepository {
  private readonly oauth2Server

  constructor (
    oauthServer: OAuthServer
  ) {
    this.oauth2Server = oauthServer
  }

  async authorizationCode (authRequest: AuthorizationCodeRepositoryParams): Promise<AuthorizationCode> {
    const { clientId, redirectUri, state, codeChallenge, codeChallengeMethod, scope, nonce, user, responseType } = authRequest

    const request = new Request({
      method: 'GET',
      query: {
        client_id: clientId,
        state,
        // bug: For the moment, there is a bug in the library that does not allow the scope to be passed in the query using an array
        scope: (scope !== null && scope !== undefined && scope.length > 0) ? scope[0] : null,
        redirect_uri: redirectUri,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod,
        nonce,
        response_type: responseType
      },
      headers: {}
    })

    const response = new Response()

    const code = await this.oauth2Server.getOAuth2Server().authorize(request, response, {
      authenticateHandler: {
        handle: () => {
          return { id: user?.id }
        }
      }
    }
    )
    const authCode = new AuthorizationCode(code.authorizationCode, code.expiresAt, code.redirectUri, code.scope, code.codeChallenge, code.codeChallengeMethod)

    return authCode
  };
}
