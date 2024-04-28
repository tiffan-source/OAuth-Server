export interface DeleteAuthorizationCodeRepository {
  deleteAuthorizationCode: (authorizationCode: string) => Promise<void>
}
