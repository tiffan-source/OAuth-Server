import { TYPES } from '@symboles/types.js'
import 'dotenv/config'
import 'reflect-metadata'
import { ContainerModule, Container as InversifyContainer, type interfaces } from 'inversify'
import { CreateUserController } from '@presentation/controllers/user/create-user.controller.js'
import { type RegisterUser } from '@application/user/protocols/register-user.js'
import { DbRegisterUser } from '@application/user/use-cases/db-register-user.js'
import { CreateUserVineValidation } from '@infrastructure/validations/create-user.vine.validation.js'
import { type IValidation } from '@presentation/protocols/validations/validation.js'
import { CreateUserPrisma } from '@infrastructure/db/prisma/user/create-user.prisma.js'
import { PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { type DatabaseConnection } from '@data/protocols/db/database-connection.js'
import { type CreateUserRepository } from '@data/protocols/user/create-user.repository'

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
    this.container.load(this.getValidationModule())
  }

  public functionDependencies (func: (...args: any[]) => any, dependencies: any[]): (...args: any[]) => any {
    const injections = dependencies.map((dependency) => {
      return this.container.get(dependency)
    })
    return func.bind(func, ...injections)
  }

  private getGeneralModule (): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<DatabaseConnection>(TYPES.DatabaseConnection).to(PrismaDatabaseConnection)
      bind<PrismaDatabaseConnection>(TYPES.PrismaDatabaseConnection).to(PrismaDatabaseConnection)
    })
  }

  private getValidationModule (): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<IValidation>(TYPES.Validation).to(CreateUserVineValidation)
    })
  }

  private getControllerModule (): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<CreateUserController>(TYPES.CreateUserController).to(CreateUserController)
    })
  }

  private getRepositoryModule (): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<CreateUserRepository>(TYPES.CreateUserRepository).to(CreateUserPrisma)
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
