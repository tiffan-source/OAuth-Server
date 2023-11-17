import { RegisterUser } from '@application/user/protocols/register-user'
import 'reflect-metadata'
import { type Controller } from 'presentation/protocols'
import { type HttpResponse } from '@presentation/protocols/controllers/response/httpResponse'
import { created, serverError } from '@presentation/helpers'
import { type HttpUserRegister } from '@presentation/protocols/controllers/request/user/httpUserRegister'
import { injectable, inject } from 'inversify'
import { TYPES } from '@symboles/types'

@injectable()
export class CreateUserController implements Controller {
  private readonly registerUser: RegisterUser

  constructor (
  @inject(TYPES.RegisterUser) registerUser: RegisterUser
  ) {
    this.registerUser = registerUser
  }

  async handle (request: HttpUserRegister): Promise<HttpResponse> {
    // I can make validation here, but I will do it in another time
    try {
      const userResult = await this.registerUser.register(request.body)

      return created(userResult)
    } catch (error) {
      console.log(error)

      // Must be change later.... why error is unknown?
      return serverError(new Error())
    }
  }
}
