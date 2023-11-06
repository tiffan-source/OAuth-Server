import { type RegisterUser } from '../protocols/register-user'
import { type CreateUserRepository } from '@data/protocols/user/create-user.repository'
import { UserResultDto, type UserRegisterDto } from '../dtos'

export class DbRegisterUser implements RegisterUser {
  constructor (private readonly createUserRepository: CreateUserRepository) {}

  async register (user: UserRegisterDto): Promise<UserResultDto> {
    const userCreated = await this.createUserRepository.create(
      {
        name: user.getName(),
        email: user.getEmail(),
        password: user.getPassword()
      }
    )
    return new UserResultDto(
      userCreated.getId(),
      userCreated.getName(),
      userCreated.getEmail()
    )
  }
}
