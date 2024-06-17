import { VerifyAuthClientRequest } from '@application/auth/protocols/verify-auth-client-request.js'
import { badRequest, notAllowPage, page, serverError } from '@presentation/helpers/http.helpers.js'
import { type HttpAuthInitiate } from '@presentation/protocols/controllers/request/auth/httpAuthInitiate.js'
import { type HttpResponse } from '@presentation/protocols/controllers/response/httpResponse.js'
import { AuthValidation } from '@presentation/protocols/validations/auth.validation.js'
import { ErrorInitiateAuthPageRenderer } from '@presentation/renderers/error-initiate-auth-page.renderer.js'
import { LoginPageRenderer } from '@presentation/renderers/login-page.renderer.js'
import { TYPES } from '@symboles/types.js'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class InitiateAuthRequestController {
  private readonly verifyAuthClientRequest: VerifyAuthClientRequest
  private readonly authRequestValidation: AuthValidation
  private readonly loginRenderer: LoginPageRenderer
  private readonly errorInitiateLoginRenderer: ErrorInitiateAuthPageRenderer

  constructor (
  @inject(TYPES.VerifyAuthClientRequest) verifyAuthClientRequest: VerifyAuthClientRequest,
    @inject(TYPES.AuthValidation) authValidation: AuthValidation,
    @inject(TYPES.LoginPageRenderer) loginRenderer: LoginPageRenderer,
    @inject(TYPES.ErrorInitiateAuthPageRenderer) errorInitiateLoginRenderer: ErrorInitiateAuthPageRenderer
  ) {
    this.verifyAuthClientRequest = verifyAuthClientRequest
    this.authRequestValidation = authValidation
    this.loginRenderer = loginRenderer
    this.errorInitiateLoginRenderer = errorInitiateLoginRenderer
  }

  async handle (request: HttpAuthInitiate): Promise<HttpResponse> {
    try {
      await this.authRequestValidation.validate(request)
      if (!this.authRequestValidation.isValid()) {
        return badRequest(new Error(this.authRequestValidation.getErrors()[0].toString()))
      }

      const result = await this.verifyAuthClientRequest.verify({ id: request.query.clientId, ...request.query })

      if (result.valid) {
        return page(this.loginRenderer.render(result))
      }

      return notAllowPage(this.errorInitiateLoginRenderer.render(result.reason ?? 'Unknown reason'))
    } catch (error) {
      return serverError(new Error())
    }
  }
}
