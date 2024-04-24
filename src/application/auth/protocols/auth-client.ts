import { type AuthClientResultDto } from '../dtos/auth-client-result.dto'
import { type AuthClientDto } from '../dtos/auth-client.dto'

export interface AuthClient {
  auth: (authClieht: AuthClientDto) => Promise<AuthClientResultDto>
}
