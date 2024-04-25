export interface ClientDto {
  id: string
  secret?: string
  redirectUri: string
  scope?: string[]
  responseType: string
}
