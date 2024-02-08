import { CreateUserMock } from '@tests/application/mocks/user/create-user.mock.js'
import { DbRegisterUser } from '@application/user/use-cases/db-register-user.js'
import { jest } from '@jest/globals'
import { type HashRepository } from '@data/protocols/cryptography/hash.repository'
import { type CheckUserWithEmailRepository } from '@data/protocols/user/chek-user-with-email.repository'

describe('DbRegisterUser', () => {
  const hashMock: jest.Mocked<HashRepository> = {
    hashPassword: jest.fn<(password: string) => Promise<string>>().mockResolvedValue('any_hash')
  }

  const checkUserMock: jest.Mocked<CheckUserWithEmailRepository> = {
    checkUser: jest.fn<(email: string) => Promise<boolean>>().mockResolvedValue(false)
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call create of CreateUserRepository', async () => {
    const repository = new CreateUserMock()

    const registerUser = new DbRegisterUser(repository, hashMock, checkUserMock)

    const verify = jest.spyOn(repository, 'create')

    await registerUser.register({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    expect(verify).toHaveBeenCalled()
  })

  //   The test below is not well written, because it is not testing the return of the method, but the implementation of the method.
  it('should return data of type UserResultDTO', async () => {
    const repository = new CreateUserMock()
    const registerUser = new DbRegisterUser(repository, hashMock, checkUserMock)

    const result = await registerUser.register({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('email')
  })

  it('should call hashPassword of HashRepository', async () => {
    const repository = new CreateUserMock()
    const registerUser = new DbRegisterUser(repository, hashMock, checkUserMock)

    const verify = jest.spyOn(hashMock, 'hashPassword')

    await registerUser.register({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    expect(verify).toHaveBeenCalled()
  })

  it('should store the user with the hashed password', async () => {
    const repository = new CreateUserMock()
    const registerUser = new DbRegisterUser(repository, hashMock, checkUserMock)

    const create = jest.spyOn(repository, 'create')

    await registerUser.register({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })

    expect(create).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: 'any_hash'
    })
  })
})
