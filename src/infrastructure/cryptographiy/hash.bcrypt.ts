import { type HashRepository } from '@data/protocols/cryptography/hash.repository'
import bcrypt from 'bcrypt'
import { injectable } from 'inversify'

@injectable()
export class HashBcrypt implements HashRepository {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hashPassword (password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt)
  }
}
