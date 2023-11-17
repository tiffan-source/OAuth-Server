import { faker } from '@faker-js/faker'
import { CreateUserController } from '@presentation/controllers/user/create-user.controller'
import { type HttpUserRegister } from '@presentation/protocols/controllers/request/user/httpUserRegister'
import { RegisterUserMock } from '@tests/presentation/mocks/user/register-user.mock'

describe('Create User Controller', () => {
  it('should return user create with 201 status code', async () => {
    const registerUserMock = new RegisterUserMock()

    const createUserController = new CreateUserController(registerUserMock)

    const requestMock: HttpUserRegister = {
      body: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    }

    const response = await createUserController.handle(requestMock)

    expect(response).toHaveProperty('statusCode', 201)
    expect(response).toHaveProperty('body')
    expect(response).toHaveProperty('body.id')
    expect(response).toHaveProperty('body.name')
    expect(response).toHaveProperty('body.email')
  })
})
