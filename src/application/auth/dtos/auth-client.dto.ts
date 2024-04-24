import { type UserLoginResultDto } from '@application/user/dtos/user-login-result.dto'

export interface AuthClientDto {
  client: {
    id: string
    redirectUri: string
  }
  state: string
  code_challenge: string
  scope: string[]
  nonce: string
  user: UserLoginResultDto
}
