import { type VerifyAuthClientRequest as IVerifyAuthClientRequest } from '@application/auth/protocols/verify-auth-client-request.js'
import { type ClientDto } from '@application/auth/dtos/client.dto.js'
import { type ValideClientDto } from '@application/auth/dtos/valide-client.dto.js'
import { type GetClientByClientIdRepository } from '@data/protocols/auth/get-client-by-clientid.repository.js'
import { inject, injectable } from 'inversify'
import { TYPES } from '@symboles/types.js'
import 'reflect-metadata'

@injectable()
export class VerifyAuthClientRequest implements IVerifyAuthClientRequest {
  private readonly getClientByIdRepository: GetClientByClientIdRepository
  private readonly reasonMessage: string[] = [
    'Client not found',
    'RedirectUri not valid',
    'ResponseType not valid',
    'Code Challenge and Code Challenge Method are required',
    'Code Challenge is not valid'
  ]

  constructor (
  @inject(TYPES.GetClientByClientIdRepository) getClientById: GetClientByClientIdRepository
  ) {
    this.getClientByIdRepository = getClientById
  }

  async verify (authClientRequest: ClientDto): Promise<ValideClientDto> {
    const { id, redirectUri, responseType, scope, codeChallenge, codeChallengeMethod } = authClientRequest

    const client = await this.getClientByIdRepository.getClientById(id)

    if (client === null) {
      return { valid: false, reason: this.reasonMessage[0] }
    }

    if (!client.getRedirectUri().includes(redirectUri)) {
      return { valid: false, reason: this.reasonMessage[1] }
    }

    if (responseType === 'code' && !client.getGrants().includes('Authorization Code')) {
      return { valid: false, reason: this.reasonMessage[2] }
    }

    if (scope !== null && scope !== undefined && scope.length > 0) {
      for (const scopeValue of scope) {
        if (!client.getScope().includes(scopeValue)) {
          return { valid: false, reason: 'Scope not valid' }
        }
      }
    }

    if (
      (codeChallenge === undefined && codeChallengeMethod !== undefined) ||
        (codeChallenge !== undefined && codeChallengeMethod === undefined)
    ) {
      return { valid: false, reason: 'Code Challenge and Code Challenge Method are required' }
    }

    if (codeChallenge !== undefined && codeChallengeMethod !== undefined) {
      if (codeChallengeMethod !== 'S256') {
        return { valid: false, reason: 'Code Challenge Method not valid' }
      }
    }

    return { valid: true }
  }
}
