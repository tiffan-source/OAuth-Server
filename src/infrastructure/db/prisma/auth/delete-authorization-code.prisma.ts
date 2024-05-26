import { type DeleteAuthorizationCodeRepository } from '@data/protocols/auth/delete-authorization-code.repository.js'
import { type PrismaDatabaseConnection } from '../database-connection.prisma.js'

export class DeleteAuthorizationCodePrisma implements DeleteAuthorizationCodeRepository {
  private readonly prismaDatabaseConnection

  constructor (prismaDatabaseConnection: PrismaDatabaseConnection) {
    this.prismaDatabaseConnection = prismaDatabaseConnection
  }

  async deleteAuthorizationCode (code: string): Promise<void> {
    await this.prismaDatabaseConnection.getPrismaClient().authorizationCode.delete({
      where: {
        code
      }
    })
  }
}
