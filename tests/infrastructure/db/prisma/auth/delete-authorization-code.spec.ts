import { type PrismaClient } from '@prisma/client'
import { type DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { jest } from '@jest/globals'
import { DeleteAuthorizationCodePrisma } from '@infrastructure/db/prisma/auth/delete-authorization-code.prisma.js'

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

  it('should call authorization delete', async () => {
    const deleteAuthorizationCodePrisma = new DeleteAuthorizationCodePrisma(new PrismaDatabaseConnection())

    await deleteAuthorizationCodePrisma.deleteAuthorizationCode('code')

    expect(prismaMock.authorizationCode.delete).toHaveBeenCalledWith({
      where: {
        code: 'code'
      }
    })
  })
})
