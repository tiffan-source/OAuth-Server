import { type Client } from '@domain/auth/entity/client.js'

export interface GetClientByClientIdAndClientSecretRepository {
  getClientByClientIdAndClientSecret: (clientId: string, clientSecret: string) => Promise<ClientResult>
}

export type ClientResult = Client | null
