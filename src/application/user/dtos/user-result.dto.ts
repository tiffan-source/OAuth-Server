import { type User } from '@domain/user/entity/user'

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
