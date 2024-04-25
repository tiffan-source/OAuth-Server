import { type UserLoginDto } from '@application/user/dtos/user-login.dto.js'
import { type ClientDto } from './client.dto'

export interface AuthClientDto {
  client: ClientDto
  state: string
  codeChallenge: string
  codeChallengeMethod: string
  nonce: string
  user: UserLoginDto
}
