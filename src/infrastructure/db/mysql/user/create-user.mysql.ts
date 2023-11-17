import { type CreateUserRepository, type CreateUserRepositoryParams, type CreateUserRepositoryResult } from '@data/protocols/user/create-user.repository'
import { User } from '@domain/user/entity/user'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { MysqlDatabaseConnection } from '../MysqlDatabaseConnection'
import { TYPES } from '@symboles/types'
import { type ResultSetHeader } from 'mysql2'

@injectable()
export class CreateUserMysql implements CreateUserRepository {
  private readonly connection: MysqlDatabaseConnection

  constructor (
  @inject(TYPES.MysqlDatabaseConnection) connection: MysqlDatabaseConnection
  ) {
    this.connection = connection
  }

  async create (user: CreateUserRepositoryParams): Promise<CreateUserRepositoryResult> {
    return await new Promise((resolve, reject) => {
      this.connection.getConnection().query<ResultSetHeader>('INSERT INTO user SET ?', user, (err, row) => {
        if (err !== null) {
          reject(err)
        } else {
          const userR: User = new User(row.insertId.toString(), user.name, user.email, user.password)
          resolve(userR)
        }
      })
    })
  }
}
