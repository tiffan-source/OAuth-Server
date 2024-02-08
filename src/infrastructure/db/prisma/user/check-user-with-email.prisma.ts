import { TYPES } from '@symboles/types.js'
import { inject, injectable } from 'inversify'
import { PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { type CheckUserWithEmailRepository } from '@data/protocols/user/chek-user-with-email.repository'

@injectable()
export class CheckUserWithEmailPrisma implements CheckUserWithEmailRepository {
  private readonly prismaDatabaseConnection

  constructor (
  @inject(TYPES.PrismaDatabaseConnection)
    prismaDatabaseConnection: PrismaDatabaseConnection) {
    this.prismaDatabaseConnection = prismaDatabaseConnection
  }

  async checkUser (email: string): Promise<boolean> {
    const user = await this.prismaDatabaseConnection.getPrismaClient().user.findUnique({
      where: {
        email
      }
    })

    return user !== null
  }
}
