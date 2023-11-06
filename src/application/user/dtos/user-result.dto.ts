import { type User } from '@domain/user/entity/user'

export class UserResultDto {
  constructor (
    private readonly id: string,
    private readonly name: string,
    private readonly email: string
  ) { }

  public static fromEntity (user: User): UserResultDto {
    return new UserResultDto(
      user.getId(),
      user.getName(),
      user.getEmail()
    )
  }
}
