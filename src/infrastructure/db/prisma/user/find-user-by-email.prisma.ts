import { type PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { User } from '@domain/user/entity/user.js'

export class FindUserByEmailPrisma {
  private readonly prismaDatabaseConnection

  constructor (prismaDatabaseConnection: PrismaDatabaseConnection) {
    this.prismaDatabaseConnection = prismaDatabaseConnection
  }

  async findUserByEmail (email: string): Promise<User | null> {
    const user = await this.prismaDatabaseConnection.getPrismaClient().user.findUnique({
      where: {
        email
      }
    })
    if (user === null) {
      return null
    }
    return new User(String(user.id), user.name, user.email, user.password)
  }
}
