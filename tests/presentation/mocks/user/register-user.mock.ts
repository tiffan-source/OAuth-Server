import { type UserRegisterDto, type UserResultDto } from '@application/user/dtos'
import { type RegisterUser } from '@application/user/protocols/register-user'
import { faker } from '@faker-js/faker'

export class RegisterUserMock implements RegisterUser {
  async register (user: UserRegisterDto): Promise<UserResultDto> {
    return await new Promise((resolve) => {
      resolve({
        id: faker.string.uuid(),
        name: user.name,
        email: user.email
      })
    })
  }
}
