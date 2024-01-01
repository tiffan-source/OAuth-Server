import { type User } from '@domain/user/entity/user.js'

export interface UserResultDto {
  readonly id: string
  readonly name: string
  readonly email: string
}

export const fromEntityToUserResultDto = (user: User): UserResultDto => {
  return {
    id: user.getId(),
    name: user.getName(),
    email: user.getEmail()
  }
}
