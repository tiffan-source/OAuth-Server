import { type UserLoginDto } from '@application/user/dtos/user-login.dto.js'

export interface AuthClientDto {
  client: {
    id: string
    redirectUri: string
  }
  state: string
  codeChallenge: string
  scope: string[]
  nonce: string
  user: UserLoginDto
}
