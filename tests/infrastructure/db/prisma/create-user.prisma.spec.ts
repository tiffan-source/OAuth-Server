import { CreateUserPrisma } from '@infrastructure/db/prisma/user/create-user.prisma.js'
import { PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { User } from '@domain/user/entity/user.js'
import { jest } from '@jest/globals'
import { type PrismaClient } from '@prisma/client'
import { type DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'

describe('CreateUserPrisma', () => {
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>()
    jest.spyOn(PrismaDatabaseConnection.prototype, 'getPrismaClient').mockReturnValue(prismaMock)
  })

  afterEach(() => {
    mockReset(prismaMock)
    jest.restoreAllMocks()
  })

  it('should create and return a new User', async () => {
    // Arrange
    const createUserPrisma = new CreateUserPrisma(new PrismaDatabaseConnection())

    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123'
    }

    prismaMock.user.create.mockResolvedValue({
      id: 1,
      name: userData.name,
      email: userData.email,
      password: userData.password
    })

    // Act
    const createdUser = await createUserPrisma.create(userData)

    // Assert
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password
      }
    })

    expect(createdUser).toBeInstanceOf(User)
    expect(createdUser.getId()).toBe('1')
    expect(createdUser.getName()).toBe(userData.name)
    expect(createdUser.getEmail()).toBe(userData.email)
    expect(createdUser.getPassword()).toBe(userData.password)
  })

  it('should throw an error if user already exists', async () => {
    // Arrange
    const createUserPrisma = new CreateUserPrisma(new PrismaDatabaseConnection())

    const userData = {
      name: 'John Doe',
      email: 'alreadyExist.gmail.com',
      password: 'password123'
    }

    prismaMock.user.create.mockRejectedValue(new Error())

    // Act

    // Assert
    await expect(prismaMock.user.create).rejects.toThrow()
    await expect(createUserPrisma.create(userData)).rejects.toThrow()
  })
})
