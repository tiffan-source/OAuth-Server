import { type DatabaseConnection } from '@data/protocols/db/database-connection'
import { PrismaClient } from '@prisma/client'
import { injectable } from 'inversify'

injectable()
export class PrismaDatabaseConnection implements DatabaseConnection {
  private readonly prisma: PrismaClient

  constructor () {
    this.prisma = new PrismaClient()
  }

  async disconnect (): Promise<void> {
    await this.prisma.$disconnect()
  };

  async connect (): Promise<void> {
    await this.prisma.$connect()
  }

  getPrismaClient (): PrismaClient {
    return this.prisma
  }
}
