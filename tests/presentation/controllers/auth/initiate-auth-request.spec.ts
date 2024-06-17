import { type VerifyAuthClientRequest } from '@application/auth/protocols/verify-auth-client-request.js'
import { InitiateAuthRequestController } from '@presentation/controllers/auth/initiate-auth-request.controller.js'
import { type AuthValidation } from '@presentation/protocols/validations/auth.validation.js'
import { type ErrorInitiateAuthPageRenderer } from '@presentation/renderers/error-initiate-auth-page.renderer.js'
import { type LoginPageRenderer } from '@presentation/renderers/login-page.renderer.js'
import { jest } from '@jest/globals'
import { ValidationError } from '@presentation/protocols/validations/validation-error.js'

describe('Initiate Auth Request Controller', () => {
  let authValidation: jest.Mocked<AuthValidation>

  let verifyAuth: jest.Mocked<VerifyAuthClientRequest>

  let loginPageRender: jest.Mocked<LoginPageRenderer>

  let errorInitiateAuthPageRenderer: jest.Mocked<ErrorInitiateAuthPageRenderer>

  beforeEach(() => {
    authValidation = {
      validate: jest.fn(),
      getErrors: jest.fn(),
      isValid: jest.fn()
    }

    verifyAuth = {
      verify: jest.fn()
    }
    loginPageRender = {
      render: jest.fn()
    }
    errorInitiateAuthPageRenderer = {
      render: jest.fn()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 status code if bad request about validation field and error page', async () => {
    const initiateAuthRequestController = new InitiateAuthRequestController(verifyAuth, authValidation, loginPageRender, errorInitiateAuthPageRenderer)

    authValidation.isValid.mockReturnValue(false)
    authValidation.getErrors.mockReturnValue([new ValidationError('email', 'any_error')])

    const result = await initiateAuthRequestController.handle({
      query: {
        clientId: '',
        redirectUri: '',
        responseType: ''
      }
    })

    expect(result.statusCode).toBe(400)
    expect(authValidation.validate).toHaveBeenCalled()
    expect(authValidation.getErrors).toHaveBeenCalled()
  })

  it('should return 401 status code if bad request about not allow request', async () => {
    const initiateAuthRequestController = new InitiateAuthRequestController(verifyAuth, authValidation, loginPageRender, errorInitiateAuthPageRenderer)

    authValidation.isValid.mockReturnValue(true)
    verifyAuth.verify.mockResolvedValue({
      valid: false,
      reason: 'Not allowed'
    })
    errorInitiateAuthPageRenderer.render.mockReturnValue('Not allowed')

    const result = await initiateAuthRequestController.handle({
      query: {
        clientId: '',
        redirectUri: '',
        responseType: ''
      }
    })

    expect(result.statusCode).toBe(401)
    expect(errorInitiateAuthPageRenderer.render).toHaveBeenCalled()
  })

  it('should return 200 status code if request is valid', async () => {
    const initiateAuthRequestController = new InitiateAuthRequestController(verifyAuth, authValidation, loginPageRender, errorInitiateAuthPageRenderer)

    authValidation.isValid.mockReturnValue(true)
    verifyAuth.verify.mockResolvedValue({
      valid: true
    })
    loginPageRender.render.mockReturnValue('html')

    const result = await initiateAuthRequestController.handle({
      query: {
        clientId: '123',
        redirectUri: 'http://localhost:3000/callback',
        responseType: 'code'
      }
    })

    expect(result.statusCode).toBe(200)
    expect(loginPageRender.render).toHaveBeenCalled()
    expect(typeof result.body).toBe('string')
  })
})
