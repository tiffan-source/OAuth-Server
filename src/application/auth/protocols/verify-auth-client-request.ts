import { type ClientDto } from '@application/auth/dtos/client.dto.js'
import { type ValideClientDto } from '@application/auth/dtos/valide-client.dto.js'

export interface VerifyAuthClientRequest {
  verify: (authClientRequest: ClientDto) => Promise<ValideClientDto>
}
