import { type VerifyAuthClientRequest as IVerifyAuthClientRequest } from '@application/auth/protocols/verify-auth-client-request.js'
import { type ClientDto } from '@application/auth/dtos/client.dto.js'
import { type ValideClientDto } from '@application/auth/dtos/valide-client.dto.js'
import { type GetClientByIdRepository } from '@data/protocols/auth/get-client-by-id.repository'

export class VerifyAuthClientRequest implements IVerifyAuthClientRequest {
  private readonly getClientByIdRepository: GetClientByIdRepository
  private readonly reasonMessage: string[] = [
    'Client not found',
    'RedirectUri not valid',
    'ResponseType not valid'
  ]

  constructor (getClientById: GetClientByIdRepository) {
    this.getClientByIdRepository = getClientById
  }

  async verify (authClientRequest: ClientDto): Promise<ValideClientDto> {
    const { id, redirectUri, responseType, scope } = authClientRequest

    const client = await this.getClientByIdRepository.getClientById(id)

    if (client.client === null) {
      return { valid: false, reason: this.reasonMessage[0] }
    }

    if (!client.client.getRedirectUri().includes(redirectUri)) {
      return { valid: false, reason: this.reasonMessage[1] }
    }

    if (responseType === null || !client.client.getResponsesTypes().includes(responseType)) {
      return { valid: false, reason: this.reasonMessage[2] }
    }

    if (scope !== null && scope !== undefined && scope.length > 0) {
      for (const scopeValue of scope) {
        if (!client.client.getScope().includes(scopeValue)) {
          return { valid: false, reason: 'Scope not valid' }
        }
      }
    }

    return { valid: true }
  }
}
