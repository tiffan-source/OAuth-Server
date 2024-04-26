import { type Client } from '@domain/auth/entity/client'

export interface GetClientByClientIdRepository {
  getClientById: (id: string) => Promise<ClientResult>
}

export type ClientResult = Client | null
