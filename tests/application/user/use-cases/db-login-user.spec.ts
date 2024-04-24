import { DbLoginUser } from '@application/user/use-cases/db-login-user.js'
import { type CompareHashRepository } from '@data/protocols/cryptography/compare-hash.repository.js'
import { type FindUserByEmailRepository, type FindUserByEmailRepositoryParams, type FindUserByEmailRepositoryResult } from '@data/protocols/user/find-user-by-email.repository.js'
import { User } from '@domain/user/entity/user.js'
import { jest } from '@jest/globals'

describe('DbLoginUser', () => {
  const findUserByEmailRepository: jest.Mocked<FindUserByEmailRepository> = {
    findUserByEmail: jest.fn<(user: FindUserByEmailRepositoryParams) => Promise<FindUserByEmailRepositoryResult>>().mockResolvedValue({ user: null })
  }

  const compareHashRepository: jest.Mocked<CompareHashRepository> = {
    compare: jest.fn<(plainText: string, hashedText: string) => Promise<boolean>>().mockResolvedValue(true)
  }

  it('should return data of type UserLoginResultDto', async () => {
    const loginUser = new DbLoginUser(findUserByEmailRepository, compareHashRepository)

    const result = await loginUser.login({
      email: 'any_email',
      password: 'any_password'
    })

    expect(result).toHaveProperty('user')
  })

  it('should return null if user does not exist', async () => {
    const loginUser = new DbLoginUser(findUserByEmailRepository, compareHashRepository)

    const result = await loginUser.login({
      email: 'any_email',
      password: 'any_password'
    })

    expect(result.user).toBeNull()
  })

  it('should return null if password does not match', async () => {
    const loginUser = new DbLoginUser(findUserByEmailRepository, compareHashRepository)

    compareHashRepository.compare.mockResolvedValue(false)

    const result = await loginUser.login({
      email: 'any_email',
      password: 'any_password'
    })

    expect(result.user).toBeNull()
  })

  it('should call findUserByEmailRepository with correct values', async () => {
    const loginUser = new DbLoginUser(findUserByEmailRepository, compareHashRepository)

    await loginUser.login({
      email: 'any_email',
      password: 'any_password'
    })

    expect(findUserByEmailRepository.findUserByEmail).toHaveBeenCalledWith({ email: 'any_email' })
  })

  it('should call compareHashRepository with correct values', async () => {
    const loginUser = new DbLoginUser(findUserByEmailRepository, compareHashRepository)

    const user: User = new User('any_id', 'any_name', 'any_email', 'hashed_password')

    findUserByEmailRepository.findUserByEmail.mockResolvedValue({ user })

    await loginUser.login({
      email: 'any_email',
      password: 'any_password'
    })

    expect(compareHashRepository.compare).toHaveBeenCalledWith('any_password', user.getPassword())
  })

  it('should return user data if password matches', async () => {
    const loginUser = new DbLoginUser(findUserByEmailRepository, compareHashRepository)

    const user: User = new User('any_id', 'any_name', 'any_email', 'hashed_password')

    findUserByEmailRepository.findUserByEmail.mockResolvedValue({ user })
    compareHashRepository.compare.mockResolvedValue(true)

    const result = await loginUser.login({
      email: 'any_email',
      password: 'any_password'
    })

    expect(result.user).toEqual({ id: user.getId() })
  })
})
