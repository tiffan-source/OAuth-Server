export interface CheckUserWithEmailRepository {
  checkUser: (email: CheckUserWithEmailRepositoryParams) => Promise<CheckUserWithEmailRepositoryResult>
}

export type CheckUserWithEmailRepositoryParams = string

export type CheckUserWithEmailRepositoryResult = boolean
