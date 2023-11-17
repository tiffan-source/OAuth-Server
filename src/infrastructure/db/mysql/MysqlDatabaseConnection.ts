import { type DatabaseConnection } from '@data/protocols/db/database-connection'
import { injectable } from 'inversify'
import { createConnection, type Connection } from 'mysql2'
import 'reflect-metadata'

@injectable()
export class MysqlDatabaseConnection implements DatabaseConnection {
  private connection: Connection | undefined = undefined

  constructor (
    private readonly host: string,
    private readonly port: number,
    private readonly username: string,
    private readonly password: string,
    private readonly database: string
  ) {
  }

  public async connect (): Promise<void> {
    this.connection = createConnection({
      host: this.host,
      port: this.port,
      user: this.username,
      password: this.password,
      database: this.database
    })
  }

  public async disconnect (): Promise<void> {
    try {
      if (this.connection !== undefined) {
        this.connection.end()
      }
    } catch (error) {
      console.log(error)
    }
  }

  public getConnection (): Connection {
    if (this.connection !== undefined) {
      return this.connection
    }
    throw new Error('No connection')
  }
}
