import { type VerifyAuthClientRequest as IVerifyAuthClientRequest } from '@application/auth/protocols/verify-auth-client-request.js'
import { type ClientDto } from '@application/auth/dtos/client.dto.js'
import { type ValideClientDto } from '@application/auth/dtos/valide-client.dto.js'
import { type GetClientByClientIdRepository } from '@data/protocols/auth/get-client-by-clientid.repository.js'

export class VerifyAuthClientRequest implements IVerifyAuthClientRequest {
  private readonly getClientByIdRepository: GetClientByClientIdRepository
  private readonly reasonMessage: string[] = [
    'Client not found',
    'RedirectUri not valid',
    'ResponseType not valid'
  ]

  constructor (getClientById: GetClientByClientIdRepository) {
    this.getClientByIdRepository = getClientById
  }

  async verify (authClientRequest: ClientDto): Promise<ValideClientDto> {
    const { id, redirectUri, responseType, scope } = authClientRequest

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

    return { valid: true }
  }
}
