import { RegisterUser } from '@application/user/protocols/register-user.js'
import 'reflect-metadata'
import { type Controller } from '@presentation/protocols/controllers/controller.js'
import { type HttpResponse } from '@presentation/protocols/controllers/response/httpResponse.js'
import { badRequest, created, serverError } from '@presentation/helpers/http.helpers.js'
import { type HttpUserRegister } from '@presentation/protocols/controllers/request/user/httpUserRegister.js'
import { injectable, inject } from 'inversify'
import { TYPES } from '@symboles/types.js'
import { IValidation } from '@presentation/protocols/validations/validation.js'
import { UserAlreadyExistError } from '@application/user/errors/user-already-exist.error.js'

@injectable()
export class CreateUserController implements Controller {
  private readonly registerUser: RegisterUser
  private readonly validation: IValidation

  constructor (
  @inject(TYPES.RegisterUser) registerUser: RegisterUser,
    @inject(TYPES.Validation) validation: IValidation
  ) {
    this.registerUser = registerUser
    this.validation = validation
  }

  async handle (request: HttpUserRegister): Promise<HttpResponse> {
    try {
      await this.validation.validate(request)

      if (!this.validation.isValid()) {
        const error = new Error(this.validation.getErrors()[0].toString())
        console.log(error)

        return badRequest(error)
      }

      const userResult = await this.registerUser.register(request.body)

      return created(userResult)
    } catch (error) {
      if (error instanceof UserAlreadyExistError) {
        return badRequest(error)
      }
      return serverError(new Error())
    }
  }
}
