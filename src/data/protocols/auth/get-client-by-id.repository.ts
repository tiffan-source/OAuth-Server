import { type Client } from '@domain/auth/entity/client'

export interface GetClientByIdRepository {
  getClientById: (id: string) => Promise<ClientResult>
}

export interface ClientResult {
  client: Client | null
}
