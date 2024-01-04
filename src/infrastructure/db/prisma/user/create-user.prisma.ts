import { type CreateUserRepository, type CreateUserRepositoryParams, type CreateUserRepositoryResult } from '@data/protocols/user/create-user.repository.js'
import { User } from '@domain/user/entity/user.js'
import { PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { TYPES } from '@symboles/types.js'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { Prisma } from '@prisma/client'

@injectable()
export class CreateUserPrisma implements CreateUserRepository {
  private readonly prismaDatabaseConnection

  constructor (
  @inject(TYPES.PrismaDatabaseConnection)
    prismaDatabaseConnection: PrismaDatabaseConnection) {
    this.prismaDatabaseConnection = prismaDatabaseConnection
  }

  async create (data: CreateUserRepositoryParams): Promise<CreateUserRepositoryResult> {
    try {
      const user = await this.prismaDatabaseConnection.getPrismaClient().user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password
        }
      })

      return new User(String(user.id), user.name, user.email, user.password)
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(err.message)
      } else {
        throw new Error('Unexpected error')
      }
    }
  }
}
