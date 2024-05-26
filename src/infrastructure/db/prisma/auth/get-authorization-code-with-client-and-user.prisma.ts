import { type GetAuthorizationCodeWithClientAndUserRepository, type GetAuthorizationCodeWithClientAndUserRepositoryResult } from '@data/protocols/auth/get-authorization-code-with-client-and-user.repository.js'
import { type PrismaDatabaseConnection } from '../database-connection.prisma.js'
import { AuthorizationCode } from '@domain/auth/entity/authorization-code.js'
import { Client } from '@domain/auth/entity/client.js'
import { User } from '@domain/user/entity/user.js'

export class GetAuthorizationCodeWithClientAndUserPrisma implements GetAuthorizationCodeWithClientAndUserRepository {
  private readonly prismaDatabaseConnection

  constructor (prismaDatabaseConnection: PrismaDatabaseConnection) {
    this.prismaDatabaseConnection = prismaDatabaseConnection
  }

  async getAuthorizationCode (code: string): Promise<GetAuthorizationCodeWithClientAndUserRepositoryResult> {
    const result = await this.prismaDatabaseConnection.getPrismaClient().authorizationCode.findFirst({
      where: {
        code
      },
      include: {
        client: true,
        user: true
      }
    })

    if (result === null) { throw new Error() }

    const redirectUri = await this.prismaDatabaseConnection.getPrismaClient().redirectUri.findUnique({
      where: {
        id: result.redirectUriId
      }
    })

    if (redirectUri === null) { throw new Error() }

    const client = await this.prismaDatabaseConnection.getPrismaClient().client.findUnique({
      where: {
        id: result.client.id
      },
      include: {
        grantType: true,
        redirectUri: true
      }
    })

    if (client === null) { throw new Error() }

    const grantTypeArray = await Promise.all(client.grantType.map(async (grant) => {
      const grantType = await this.prismaDatabaseConnection.getPrismaClient().grantType.findUnique({
        where: {
          id: grant.grantTypeId
        }
      })

      return grantType?.name ?? ''
    }))

    return {
      authCode: new AuthorizationCode(result.code, result.expiresAt, redirectUri.uri, [], result.codeChallenge ?? undefined, result.codeChallengeMethod ?? undefined),
      client: new Client(client.clientId, client.clientSecret, client.redirectUri.map((uri) => uri.uri), [], grantTypeArray),
      user: new User(result.user.id + '', result.user.name, result.user.email, result.user.password)
    }
  }
}
