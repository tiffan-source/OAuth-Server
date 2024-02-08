import { type CompareHashRepository } from '@data/protocols/cryptography/compare-hash.repository'
import bcrypt from 'bcrypt'
import { injectable } from 'inversify'

@injectable()
export class CompareHashBcrypt implements CompareHashRepository {
  async compare (plainText: string, hashedText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedText)
  }
}
