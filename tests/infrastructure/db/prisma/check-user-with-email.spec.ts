import { type PrismaClient } from '@prisma/client'
import { type DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { CheckUserWithEmailPrisma } from '@infrastructure/db/prisma/user/check-user-with-email.prisma.js'
import { jest } from '@jest/globals'

describe('CheckUserWithEmailPrisma', () => {
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>()
    jest.spyOn(PrismaDatabaseConnection.prototype, 'getPrismaClient').mockReturnValue(prismaMock)
  })

  afterEach(() => {
    mockReset(prismaMock)
    jest.restoreAllMocks()
  })

  it('should return true if user exists', async () => {
    // Arrange
    const checkUserWithEmailPrisma = new CheckUserWithEmailPrisma(new PrismaDatabaseConnection())

    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'password123'
    })

    // Act

    const result = await checkUserWithEmailPrisma.checkUser('johndoe@gmail.com')

    // Assert

    expect(result).toBe(true)
  })

  it('should return false if user does not exists', async () => {
    // Arrange
    const checkUserWithEmailPrisma = new CheckUserWithEmailPrisma(new PrismaDatabaseConnection())

    prismaMock.user.findUnique.mockResolvedValue(null)

    // Act

    const result = await checkUserWithEmailPrisma.checkUser('test@gmail.com')

    // Assert

    expect(result).toBe(false)
  })
})
