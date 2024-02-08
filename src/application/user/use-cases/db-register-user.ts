import { type RegisterUser } from '@application/user/protocols/register-user.js'
import { type CreateUserRepository } from '@data/protocols/user/create-user.repository.js'
import { type UserResultDto, fromEntityToUserResultDto } from '@application/user/dtos/user-result.dto.js'
import { type UserRegisterDto } from '@application/user/dtos/user-register.dto.js'

import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '@symboles/types.js'
import { HashRepository } from '@data/protocols/cryptography/hash.repository'
import { CheckUserWithEmailRepository } from '@data/protocols/user/chek-user-with-email.repository'
import { UserAlreadyExistError } from '@application/user/errors/user-already-exist.error.js'

@injectable()
export class DbRegisterUser implements RegisterUser {
  private readonly createUserRepository: CreateUserRepository
  private readonly hashRepository: HashRepository
  private readonly checkuserwithemailrepository: CheckUserWithEmailRepository

  constructor (
  @inject(TYPES.CreateUserRepository) createUserRepository: CreateUserRepository,
    @inject(TYPES.HashRepository) hashRepository: HashRepository,
    @inject(TYPES.CheckUserWithEmailRepository) checkuserwithemailrepository: CheckUserWithEmailRepository
  ) {
    this.createUserRepository = createUserRepository
    this.hashRepository = hashRepository
    this.checkuserwithemailrepository = checkuserwithemailrepository
  }

  async register (user: UserRegisterDto): Promise<UserResultDto> {
    if (await this.checkuserwithemailrepository.checkUser(user.email)) {
      throw new UserAlreadyExistError()
    }
    const hashedPassword = await this.hashRepository.hashPassword(user.password)
    const userWithHashedPassword = { ...user, password: hashedPassword }
    const userCreated = await this.createUserRepository.create(userWithHashedPassword)
    return fromEntityToUserResultDto(userCreated)
  }
}
