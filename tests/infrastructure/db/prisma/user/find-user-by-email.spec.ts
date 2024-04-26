import { type PrismaClient } from '@prisma/client'
import { type DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { FindUserByEmailPrisma } from '@infrastructure/db/prisma/user/find-user-by-email.prisma.js'
import { jest } from '@jest/globals'
import { User } from '@domain/user/entity/user.js'

describe('FindUserByEmailPrisma', () => {
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>()
    jest.spyOn(PrismaDatabaseConnection.prototype, 'getPrismaClient').mockReturnValue(prismaMock)
  })

  afterEach(() => {
    mockReset(prismaMock)
    jest.restoreAllMocks()
  })

  it('should return data of type User if user exists', async () => {
    // Arrange
    const findUserByEmailPrisma = new FindUserByEmailPrisma(new PrismaDatabaseConnection())

    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'John Doe',
      email: 'any@gmail.com',
      password: 'password123'
    })

    // Act

    const result = await findUserByEmailPrisma.findUserByEmail('any@gmail.com')

    // Assert

    expect(result).toBeInstanceOf(User)
    expect(result?.getEmail()).toBe('any@gmail.com')
  })

  it('should return null if user does not exists', async () => {
    // Arrange
    const findUserByEmailPrisma = new FindUserByEmailPrisma(new PrismaDatabaseConnection())

    prismaMock.user.findUnique.mockResolvedValue(null)

    // Act

    const result = await findUserByEmailPrisma.findUserByEmail('any')

    // Assert

    expect(result).toBeNull()
  })
})
