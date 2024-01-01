import { CreateUserMock } from '@tests/application/mocks/user/create-user.mock.js'
import { DbRegisterUser } from '@application/user/use-cases/db-register-user.js'
import { jest } from '@jest/globals'

describe('DbRegisterUser', () => {
  it('should call create of CreateUserRepository', async () => {
    const repository = new CreateUserMock()
    const registerUser = new DbRegisterUser(repository)

    const verify = jest.spyOn(repository, 'create')

    await registerUser.register({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    expect(verify).toHaveBeenCalled()
  })

  it('should return data of type UserResultDTO', async () => {
    const repository = new CreateUserMock()
    const registerUser = new DbRegisterUser(repository)

    const result = await registerUser.register({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('email')
  })
})
