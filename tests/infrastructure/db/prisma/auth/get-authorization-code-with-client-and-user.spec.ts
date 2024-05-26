import { type PrismaClient } from '@prisma/client'
import { type DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { jest } from '@jest/globals'
import { GetAuthorizationCodeWithClientAndUserPrisma } from '@infrastructure/db/prisma/auth/get-authorization-code-with-client-and-user.prisma.js'
import { AuthorizationCode } from '@domain/auth/entity/authorization-code.js'
import { Client } from '@domain/auth/entity/client.js'
import { User } from '@domain/user/entity/user.js'

describe('GetClientByClientIdPrisma', () => {
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>()
    jest.spyOn(PrismaDatabaseConnection.prototype, 'getPrismaClient').mockReturnValue(prismaMock)
  })

  afterEach(() => {
    mockReset(prismaMock)
    jest.restoreAllMocks()
  })

  it('should return data of type GetAuthorizationCodeWithClientAndUserRepositoryResult', async () => {
    const getAuthorizationCodeWithClientAndUserPrisma = new GetAuthorizationCodeWithClientAndUserPrisma(new PrismaDatabaseConnection())

    const authCodeReturnExpect = {
      user: {
        id: 1,
        name: 'John Doe',
        email: 'any@gmail',
        password: '123'
      },
      client: {
        id: 1,
        clientId: '123',
        clientSecret: '123'
      },
      id: 1,
      code: 'code',
      expiresAt: new Date(),
      redirectUriId: 1,
      clientId: '123',
      userId: 1,
      codeChallenge: '123',
      codeChallengeMethod: '123'

    }

    const clientReturnExpect = {
      ...authCodeReturnExpect.client,
      grantType: [],
      redirectUri: [{ id: 1, uri: 'http://localhost:3000', clientId: '123' }]
    }

    const redirectUriReturnExpect = {
      id: 1,
      uri: 'http://localhost:3000',
      clientId: '123'
    }

    prismaMock.authorizationCode.findFirst.mockResolvedValue(authCodeReturnExpect)
    prismaMock.client.findUnique.mockResolvedValue(clientReturnExpect)
    prismaMock.redirectUri.findUnique.mockResolvedValue(redirectUriReturnExpect)

    const result = await getAuthorizationCodeWithClientAndUserPrisma.getAuthorizationCode('code')

    expect(prismaMock.authorizationCode.findFirst).toHaveBeenCalledWith({
      where: {
        code: 'code'
      },
      include: {
        client: true,
        user: true
      }
    })

    expect(prismaMock.client.findUnique).toHaveBeenCalledWith({
      where: {
        id: authCodeReturnExpect.client.id
      },
      include: {
        grantType: true,
        redirectUri: true
      }
    })

    expect(prismaMock.redirectUri.findUnique).toHaveBeenCalledWith({
      where: {
        id: authCodeReturnExpect.redirectUriId
      }
    })

    expect(result?.authCode).toBeInstanceOf(AuthorizationCode)
    expect(result?.client).toBeInstanceOf(Client)
    expect(result?.user).toBeInstanceOf(User)
  })
})
