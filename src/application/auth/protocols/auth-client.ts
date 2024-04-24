export interface AuthUser {
  auth: (email: string, password: string) => Promise<string>
}
