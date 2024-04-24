import { type LoginUser } from '@application/user/protocols/login-user.js'
import { type UserLoginResultDto } from '@application/user/dtos/user-login-result.dto.js'
import { type UserLoginDto } from '@application/user/dtos/user-login.dto.js'
import { type FindUserByEmailRepository } from '@data/protocols/user/find-user-by-email.repository.js'
import { type CompareHashRepository } from '@data/protocols/cryptography/compare-hash.repository.js'

export class DbLoginUser implements LoginUser {
  private readonly findUserByEmailRepository: FindUserByEmailRepository
  private readonly compareHashRepository: CompareHashRepository

  constructor (
    findUserByEmailRepository: FindUserByEmailRepository,
    compareHashRepository: CompareHashRepository
  ) {
    this.findUserByEmailRepository = findUserByEmailRepository
    this.compareHashRepository = compareHashRepository
  }

  async login (user: UserLoginDto): Promise<UserLoginResultDto> {
    const userFound = await this.findUserByEmailRepository.findUserByEmail({ email: user.email })

    if (userFound.user === null) {
      return { user: null }
    }

    const passwordMatch = await this.compareHashRepository.compare(user.password, userFound.user.getPassword())

    if (!passwordMatch) {
      return { user: null }
    }

    return { user: { id: userFound.user.getId() } }
  }
}
