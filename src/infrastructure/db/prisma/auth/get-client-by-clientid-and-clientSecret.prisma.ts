import { type GetClientByClientIdAndClientSecretRepository } from '@data/protocols/auth/get-client-by-clientid-and-clientSecret.repository.js'
import { type PrismaDatabaseConnection } from '../database-connection.prisma.js'
import { Client } from '@domain/auth/entity/client.js'

export class GetClientByClientIdAndClientSecretPrisma implements GetClientByClientIdAndClientSecretRepository {
  private readonly prismaDatabaseConnection

  constructor (prismaDatabaseConnection: PrismaDatabaseConnection) {
    this.prismaDatabaseConnection = prismaDatabaseConnection
  }

  async getClientByClientIdAndClientSecret (id: string, clientSecret: string): Promise<Client | null> {
    const client = await this.prismaDatabaseConnection.getPrismaClient().client.findUnique({
      include: {
        redirectUri: true,
        grantType: true
      },
      where: {
        clientId: id,
        clientSecret
      }
    })

    if (client === null) {
      return null
    }

    // Create grant type string array

    let grantType: string[] = []
    let redirectUri: string[] = []

    if (client.grantType !== null && client.grantType !== undefined) {
      grantType = await Promise.all(client.grantType.map(async (grant) => {
        const grantType = await this.prismaDatabaseConnection.getPrismaClient().grantType.findUnique({
          where: {
            id: grant.grantTypeId
          }
        })

        return grantType?.name ?? ''
      }))
    }

    if (client.redirectUri !== null && client.redirectUri !== undefined) {
      redirectUri = client.redirectUri.map((uri) => uri.uri)
    }

    grantType = grantType.filter((grant) => grant !== '')

    return new Client(
      client.clientId,
      client.clientSecret,
      redirectUri,
      [],
      grantType
    )
  }
}
