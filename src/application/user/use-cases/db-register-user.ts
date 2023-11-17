import { type RegisterUser } from '@application/user/protocols/register-user'
import { type CreateUserRepository } from '@data/protocols/user/create-user.repository'
import { type UserResultDto, type UserRegisterDto, fromEntityToUserResultDto } from '../dtos'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TYPES } from '@symboles/types'
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
