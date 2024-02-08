export interface HashRepository {
  hashPassword: (password: string) => Promise<string>
}
