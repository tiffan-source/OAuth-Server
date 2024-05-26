import { type CreateAuthorizationCodeRepository, type CreateAuthorizationCodeRepositoryParams } from '@data/protocols/auth/create-authorization-code.repository.js'
import { AuthorizationCode } from '@domain/auth/entity/authorization-code.js'
import { type PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'

export class CreateAuthorizationCodePrisma implements CreateAuthorizationCodeRepository {
  private readonly prismaDatabaseConnection

  constructor (prismaDatabaseConnection: PrismaDatabaseConnection) {
    this.prismaDatabaseConnection = prismaDatabaseConnection
  }

  async createAuthorizationCode (authCodeParams: CreateAuthorizationCodeRepositoryParams): Promise<AuthorizationCode> {
    // Get redirect uri
    const redirectUri = await this.prismaDatabaseConnection.getPrismaClient().redirectUri.findFirst({
      where: {
        uri: authCodeParams.redirectUri,
        clientId: authCodeParams.clientId
      }
    })

    // Get user
    const user = await this.prismaDatabaseConnection.getPrismaClient().user.findUnique({
      where: {
        id: authCodeParams.userId
      }
    })

    if (redirectUri === null || user === null) {
      throw new Error()
    }

    const authorizationCode = await this.prismaDatabaseConnection.getPrismaClient().authorizationCode.create({
      data: {
        code: authCodeParams.code,
        expiresAt: authCodeParams.expiresAt,
        redirectUriId: redirectUri.id,
        clientId: authCodeParams.clientId,
        userId: user.id,
        // scope: authCodeParams.scope,
        codeChallenge: authCodeParams.codeChallenge,
        codeChallengeMethod: authCodeParams.codeChallengeMethod
      }
    })

    return new AuthorizationCode(authorizationCode.code, authorizationCode.expiresAt, redirectUri.uri, [], authorizationCode.codeChallenge ?? undefined, authorizationCode.codeChallengeMethod ?? undefined)
  }
}
