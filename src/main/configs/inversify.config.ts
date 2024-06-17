import { TYPES } from '@symboles/types.js'
import 'dotenv/config'
import 'reflect-metadata'
import { ContainerModule, Container as InversifyContainer, type interfaces } from 'inversify'
import { CreateUserController } from '@presentation/controllers/user/create-user.controller.js'
import { type RegisterUser } from '@application/user/protocols/register-user.js'
import { DbRegisterUser } from '@application/user/use-cases/db-register-user.js'
import { CreateUserVineValidation } from '@infrastructure/validations/create-user.vine.validation.js'
import { CreateUserPrisma } from '@infrastructure/db/prisma/user/create-user.prisma.js'
import { PrismaDatabaseConnection } from '@infrastructure/db/prisma/database-connection.prisma.js'
import { type DatabaseConnection } from '@data/protocols/db/database-connection.js'
import { type CreateUserRepository } from '@data/protocols/user/create-user.repository.js'
import { type HashRepository } from '@data/protocols/cryptography/hash.repository.js'
import { HashBcrypt } from '@infrastructure/cryptographiy/hash.bcrypt.js'
import { type CheckUserWithEmailRepository } from '@data/protocols/user/chek-user-with-email.repository.js'
import { CheckUserWithEmailPrisma } from '@infrastructure/db/prisma/user/check-user-with-email.prisma.js'
import env from '@main/configs/env.js'
import { type UserRegisterValidation } from '@presentation/protocols/validations/user-registration.validation.js'
import { InitiateAuthRequestController } from '@presentation/controllers/auth/initiate-auth-request.controller.js'
import { type AuthValidation } from '@presentation/protocols/validations/auth.validation.js'
import { InitiateAuthVineValidation } from '@infrastructure/validations/initiate-auth.vine.validation.js'
import { type VerifyAuthClientRequest as IVerifyAuthClientRequest } from '@application/auth/protocols/verify-auth-client-request.js'
import { VerifyAuthClientRequest } from '@application/auth/use-cases/verify-auth-client-request.js'
import { type LoginPageRenderer } from '@presentation/protocols/renderers/login-page.renderer.js'
import { type ErrorInitiateAuthPageRenderer } from '@presentation/protocols/renderers/error-initiate-auth-page.renderer.js'
import { ErrorInitiateAuthPageEJS } from '@infrastructure/renderers/ejs/error-initiate-auth-page.ejs.js'
import { LoginPageEJS } from '@infrastructure/renderers/ejs/login-page.ejs.js'
import { type GetClientByClientIdRepository } from '@data/protocols/auth/get-client-by-clientid.repository.js'
import { GetClientByClientIdPrisma } from '@infrastructure/db/prisma/auth/get-client-by-clientid.prisma.js'

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
    this.container.load(this.getRendererModule())
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
      bind<UserRegisterValidation>(TYPES.UserRegisterValidation).to(CreateUserVineValidation)
      bind<AuthValidation>(TYPES.AuthValidation).to(InitiateAuthVineValidation)
    })
  }

  private getControllerModule (): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<CreateUserController>(TYPES.CreateUserController).to(CreateUserController)
      bind<InitiateAuthRequestController>(TYPES.InitiateAuthRequestController).to(InitiateAuthRequestController)
    })
  }

  private getRepositoryModule (): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<CreateUserRepository>(TYPES.CreateUserRepository).to(CreateUserPrisma)
      bind<HashRepository>(TYPES.HashRepository).toConstantValue(new HashBcrypt(Number(env.salt)))
      bind<CheckUserWithEmailRepository>(TYPES.CheckUserWithEmailRepository).to(CheckUserWithEmailPrisma)
      bind<GetClientByClientIdRepository>(TYPES.GetClientByClientIdRepository).to(GetClientByClientIdPrisma)
    })
  }

  private getUseCaseModule (): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<RegisterUser>(TYPES.RegisterUser).to(DbRegisterUser)
      bind<IVerifyAuthClientRequest>(TYPES.VerifyAuthClientRequest).to(VerifyAuthClientRequest)
    })
  }

  private getRendererModule (): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<LoginPageRenderer>(TYPES.LoginPageRenderer).to(LoginPageEJS)
      bind<ErrorInitiateAuthPageRenderer>(TYPES.ErrorInitiateAuthPageRenderer).to(ErrorInitiateAuthPageEJS)
    })
  }

  public getContainer (): InversifyContainer {
    return this.container
  }
}
