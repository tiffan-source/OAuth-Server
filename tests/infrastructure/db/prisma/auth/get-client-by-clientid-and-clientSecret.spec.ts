import { type PrismaClient } from '@prisma/client'
import { type DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { jest } from '@jest/globals'
import { GetClientByClientIdAndClientSecretPrisma } from '@infrastructure/db/prisma/auth/get-client-by-clientid-and-clientSecret.prisma.js'
import { Client } from '@domain/auth/entity/client.js'

describe('GetClientByClientIdAndClientSecretPrisma', () => {
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>()
    jest.spyOn(PrismaDatabaseConnection.prototype, 'getPrismaClient').mockReturnValue(prismaMock)
  })

  afterEach(() => {
    mockReset(prismaMock)
    jest.restoreAllMocks()
  })

  it('should return data of type Client if client exists', async () => {
    // Arrange
    const getClientByClientIdPrisma = new GetClientByClientIdAndClientSecretPrisma(new PrismaDatabaseConnection())

    prismaMock.client.findUnique.mockResolvedValue({
      id: 1,
      clientId: '123',
      clientSecret: '123'

    })

    // Act

    const result = await getClientByClientIdPrisma.getClientByClientIdAndClientSecret('123', '123')

    // Assert

    expect(result).toBeInstanceOf(Client)
    expect(result?.getId()).toBe('123')
    expect(result?.getSecret()).toBe('123')
  })

  it('should return null if client does not exists', async () => {
    // Arrange
    const getClientByClientIdPrisma = new GetClientByClientIdAndClientSecretPrisma(new PrismaDatabaseConnection())

    prismaMock.client.findUnique.mockResolvedValue(null)

    // Act

    const result = await getClientByClientIdPrisma.getClientByClientIdAndClientSecret('123', '123')

    // Assert

    expect(result).toBeNull()
  })
})
