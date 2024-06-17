import { Client } from '@domain/auth/entity/client.js'
import { type PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { type GetClientByClientIdRepository } from '@data/protocols/auth/get-client-by-clientid.repository.js'
import { inject, injectable } from 'inversify'
import { TYPES } from '@symboles/types.js'

@injectable()
export class GetClientByClientIdPrisma implements GetClientByClientIdRepository {
  private readonly prismaDatabaseConnection

  constructor (
  @inject(TYPES.PrismaDatabaseConnection)
    prismaDatabaseConnection: PrismaDatabaseConnection
  ) {
    this.prismaDatabaseConnection = prismaDatabaseConnection
  }

  async getClientById (id: string): Promise<Client | null> {
    const client = await this.prismaDatabaseConnection.getPrismaClient().client.findUnique({
      include: {
        redirectUri: true,
        grantType: true
      },
      where: {
        clientId: id
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
