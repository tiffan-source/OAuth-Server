import { type CreateUserRepository } from '@data/protocols/user/create-user.repository'

export class CreateUserMysql implements CreateUserRepository {
  async create (user: any): Promise<any> {
    // throw new Error("Method not implemented.");
    return {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
  }
}
