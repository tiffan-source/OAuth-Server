import { faker } from '@faker-js/faker'
import { CreateUserVineValidation } from '@infrastructure/validations/create-user.vine.validation.js'
import { type HttpUserRegister } from '@presentation/protocols/controllers/request/user/httpUserRegister.js'

describe('CreateUserVineValidation', () => {
  let createUserVineValidation: CreateUserVineValidation

  beforeEach(() => {
    createUserVineValidation = new CreateUserVineValidation()
  })

  it('should not get error for good field', async () => {
    const user: HttpUserRegister = {
      body: {
        name: 'any_name',
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password()
      }
    }

    await createUserVineValidation.validate(user)

    expect(createUserVineValidation.getErrors().length).toBe(0)
    expect(createUserVineValidation.isValid()).toBe(true)
  })

  it('should get error', async () => {
    const user: HttpUserRegister = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
    await createUserVineValidation.validate(user)

    expect(createUserVineValidation.getErrors().length).toBeGreaterThan(0)
    expect(createUserVineValidation.isValid()).toBe(false)
  })
})
