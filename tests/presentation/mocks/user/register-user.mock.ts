import { type UserResultDto } from '@application/user/dtos/user-result.dto'
import { type UserRegisterDto } from '@application/user/dtos/user-register.dto'
import { type RegisterUser } from '@application/user/protocols/register-user.js'
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
