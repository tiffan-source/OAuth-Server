import OAuth2Server from '@node-oauth/oauth2-server'
import { type OAuthModel } from '@infrastructure/oauth2-server/oauth-models.js'

export class OAuthServer {
  private readonly oauth2Server

  constructor (
    oauthModel: OAuthModel
  ) {
    this.oauth2Server = new OAuth2Server({
      model: oauthModel
    })
  }

  // Return type must be fixed
  getOAuth2Server (): any {
    return this.oauth2Server
  }
}
