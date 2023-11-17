import { TYPES } from '@symboles/types'
import { type DatabaseConnection } from '@data/protocols/db/database-connection'
import { ContainerModule, Container as InversifyContainer, type interfaces } from 'inversify'
import 'dotenv/config'
import env from './env'
import { MysqlDatabaseConnection } from '@infrastructure/db/mysql/MysqlDatabaseConnection'
import { CreateUserController } from '@presentation/controllers/user/create-user.controller'
import { type CreateUserRepository } from '@data/protocols/user/create-user.repository'
import { CreateUserMysql } from '@infrastructure/db/mysql/user/create-user.mysql'
import { type RegisterUser } from '@application/user/protocols/register-user'
import { DbRegisterUser } from '@application/user/use-cases/db-register-user'

export class Container {
  private readonly container: InversifyContainer = new InversifyContainer()

  constructor () {
    this.register()
  }

  private register (): void {
    this.container.load(this.getGeneralModule())
    this.container.load(this.getControllerModule())
    this.container.load(this.getRepositoryModule())
    this.container.load(this.getUseCaseModule())
  }

  public functionDependencies (func: (...args: any[]) => any, dependencies: any[]): (...args: any[]) => any {
    const injections = dependencies.map((dependency) => {
      return this.container.get(dependency)
    })
    return func.bind(func, ...injections)
  }

  private getGeneralModule (): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      const connection = new MysqlDatabaseConnection(
        env.mysql.host,
        env.mysql.port as number,
        env.mysql.user,
        env.mysql.password,
        env.mysql.database
      )

      bind<MysqlDatabaseConnection>(TYPES.MysqlDatabaseConnection).toConstantValue(connection)

      bind<DatabaseConnection>(TYPES.DatabaseConnection).toConstantValue(connection)
    })
  }

  private getControllerModule (): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<CreateUserController>(TYPES.CreateUserController).to(CreateUserController)
    })
  }

  private getRepositoryModule (): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<CreateUserRepository>(TYPES.CreateUserRepository).to(CreateUserMysql)
    })
  }

  private getUseCaseModule (): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<RegisterUser>(TYPES.RegisterUser).to(DbRegisterUser)
    })
  }

  public getContainer (): InversifyContainer {
    return this.container
  }
}
