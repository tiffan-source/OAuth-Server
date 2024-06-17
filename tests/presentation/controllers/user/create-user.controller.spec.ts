import { type RegisterUser } from '@application/user/protocols/register-user.js'
import { faker } from '@faker-js/faker'
import { CreateUserController } from '@presentation/controllers/user/create-user.controller.js'
import { type HttpUserRegister } from '@presentation/protocols/controllers/request/user/httpUserRegister.js'
import { ValidationError } from '@presentation/protocols/validations/validation-error.js'
import { RegisterUserMock } from '@tests/presentation/mocks/user/register-user.mock.js'
import { jest } from '@jest/globals'
import { type UserRegisterDto } from '@application/user/dtos/user-register.dto.js'
import { UserAlreadyExistError } from '@application/user/errors/user-already-exist.error.js'
import { type UserRegisterValidation } from '@presentation/protocols/validations/user-registration.validation'

// type registerUserFuntion = (user: UserRegisterDto) => Promise<UserResultDto>

describe('Create User Controller', () => {
  it('should return user create with 201 status code', async () => {
    const registerUserMock = new RegisterUserMock()

    const mockValidation: jest.Mocked<UserRegisterValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn<() => ValidationError[]>().mockReturnValue([]),
      isValid: jest.fn<() => boolean>().mockReturnValue(true)
    }

    const validateSpy = jest.spyOn(mockValidation, 'validate')

    const createUserController = new CreateUserController(registerUserMock, mockValidation)
    const requestMock: HttpUserRegister = {
      body: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    }

    const response = await createUserController.handle(requestMock)

    expect(validateSpy).toHaveBeenCalled()
    expect(response).toHaveProperty('statusCode', 201)
    expect(response).toHaveProperty('body')
    expect(response).toHaveProperty('body.id')
    expect(response).toHaveProperty('body.name')
    expect(response).toHaveProperty('body.email')
  })

  it('should return 400 status code if bad request about validation field', async () => {
    const registerUserMock = new RegisterUserMock()

    const mockValidation: jest.Mocked<UserRegisterValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn<() => ValidationError[]>().mockReturnValue([new ValidationError('email', 'any_error')]),
      isValid: jest.fn<() => boolean>().mockReturnValue(false)
    }

    const createUserController = new CreateUserController(registerUserMock, mockValidation)

    const requestMock: HttpUserRegister = {
      body: {
        email: '',
        name: faker.person.firstName(),
        password: faker.internet.password()
      }
    }

    const response = await createUserController.handle(requestMock)

    expect(mockValidation.validate).toHaveBeenCalled()
    expect(mockValidation.getErrors).toHaveBeenCalled()
    expect(response).toHaveProperty('statusCode', 400)
  })

  it('should return 400 status code if bad request about user already exist', async () => {
    const registerUserMock: jest.Mocked<RegisterUser> = {
      register: jest.fn<(user: UserRegisterDto) => Promise<never>>().mockRejectedValue(new UserAlreadyExistError())
    }

    const mockValidation: jest.Mocked<UserRegisterValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn<() => ValidationError[]>().mockReturnValue([]),
      isValid: jest.fn<() => boolean>().mockReturnValue(true)
    }

    const createUserController = new CreateUserController(registerUserMock, mockValidation)

    const requestMock: HttpUserRegister = {
      body: {
        email: faker.internet.email(),
        name: faker.person.firstName(),
        password: faker.internet.password()
      }
    }

    const response = await createUserController.handle(requestMock)

    expect(response).toHaveProperty('statusCode', 400)
  })

  it('should return 500 status code if bad request about something else', async () => {
    const registerUserMock: jest.Mocked<RegisterUser> = {
      register: jest.fn<(user: UserRegisterDto) => Promise<never>>().mockRejectedValue(new Error('any_error'))
    }

    const mockValidation: jest.Mocked<UserRegisterValidation> = {
      validate: jest.fn(),
      getErrors: jest.fn<() => ValidationError[]>().mockReturnValue([]),
      isValid: jest.fn<() => boolean>().mockReturnValue(true)
    }
    const createUserController = new CreateUserController(registerUserMock, mockValidation)

    const requestMock: HttpUserRegister = {
      body: {
        email: faker.internet.email(),
        name: faker.person.firstName(),
        password: faker.internet.password()
      }
    }

    const response = await createUserController.handle(requestMock)

    expect(response).toHaveProperty('statusCode', 500)
  })
})
