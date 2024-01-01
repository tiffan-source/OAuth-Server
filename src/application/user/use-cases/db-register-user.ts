import { type RegisterUser } from '@application/user/protocols/register-user.js'
import { type CreateUserRepository } from '@data/protocols/user/create-user.repository.js'
import { type UserResultDto, fromEntityToUserResultDto } from '@application/user/dtos/user-result.dto.js'
import { type UserRegisterDto } from '@application/user/dtos/user-register.dto.js'

import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '@symboles/types.js'
@injectable()

export class DbRegisterUser implements RegisterUser {
  private readonly createUserRepository: CreateUserRepository

  constructor (
  @inject(TYPES.CreateUserRepository) createUserRepository: CreateUserRepository
  ) {
    this.createUserRepository = createUserRepository
  }

  async register (user: UserRegisterDto): Promise<UserResultDto> {
    const userCreated = await this.createUserRepository.create(user)

    return fromEntityToUserResultDto(userCreated)
  }
}
