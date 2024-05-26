import { type PrismaClient } from '@prisma/client'
import { type DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { jest } from '@jest/globals'
import { CreateAuthorizationCodePrisma } from '@infrastructure/db/prisma/auth/create-authorization-code.prisma.js'

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

  it('should create and return AuthorizationCode', async () => {
    const createAuthorizationCodePrisma = new CreateAuthorizationCodePrisma(new PrismaDatabaseConnection())

    const authCodeParams = {
      code: '123',
      expiresAt: new Date(),
      redirectUri: 'http://localhost:3000',
      clientId: '123',
      userId: 123,
      codeChallenge: '123',
      codeChallengeMethod: '123'
    }

    prismaMock.redirectUri.findFirst.mockResolvedValue({
      id: 1,
      uri: authCodeParams.redirectUri,
      clientId: authCodeParams.clientId
    })

    prismaMock.user.findUnique.mockResolvedValue({
      id: 123,
      name: 'John Doe',
      email: 'any@gmail.com',
      password: '123'
    })

    prismaMock.authorizationCode.create.mockResolvedValue({
      id: 1,
      code: authCodeParams.code,
      expiresAt: authCodeParams.expiresAt,
      redirectUriId: 1,
      clientId: authCodeParams.clientId,
      userId: 123,
      codeChallenge: authCodeParams.codeChallenge,
      codeChallengeMethod: authCodeParams.codeChallengeMethod
    })

    const createdAuthorizationCode = await createAuthorizationCodePrisma.createAuthorizationCode(authCodeParams)

    expect(prismaMock.redirectUri.findFirst).toHaveBeenCalledWith({
      where: {
        uri: authCodeParams.redirectUri,
        clientId: authCodeParams.clientId
      }
    })

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: authCodeParams.userId
      }
    })

    expect(prismaMock.authorizationCode.create).toHaveBeenCalledWith({
      data: {
        code: authCodeParams.code,
        expiresAt: authCodeParams.expiresAt,
        redirectUriId: 1,
        clientId: authCodeParams.clientId,
        userId: 123,
        codeChallenge: authCodeParams.codeChallenge,
        codeChallengeMethod: authCodeParams.codeChallengeMethod
      }
    })

    expect(createdAuthorizationCode).toBeDefined()
    expect(createdAuthorizationCode.getAuthorizationCode()).toBe('123')
    expect(createdAuthorizationCode.getExpiresAt()).toBe(authCodeParams.expiresAt)
    expect(createdAuthorizationCode.getRedirectUri()).toBe('http://localhost:3000')
    expect(createdAuthorizationCode.getScope()).toStrictEqual([])
    expect(createdAuthorizationCode.getCodeChallenge()).toBe('123')
    expect(createdAuthorizationCode.getCodeChallengeMethod()).toBe('123')
  })
})
