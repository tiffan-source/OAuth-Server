import { VerifyAuthClientRequest } from '@application/auth/use-cases/verify-auth-client-request.js'
import { Client } from '@domain/auth/entity/client.js'
import { jest } from '@jest/globals'
import { type ClientDto } from '@application/auth/dtos/client.dto.js'
import { type ClientResult, type GetClientByClientIdRepository } from '@data/protocols/auth/get-client-by-clientid.repository.js'

describe('VerifyAuthClientRequest', () => {
  const getClientByIdRepositoryMock: jest.Mocked<GetClientByClientIdRepository> = {
    getClientById: jest.fn<(id: string) => Promise<ClientResult>>()
  }

  const clientDto: ClientDto = {
    id: 'any_id',
    redirectUri: 'any_redirect_uri',
    scope: ['any_scope'],
    responseType: 'code'
  }

  it('should return data of type ValideClientDto', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)
    getClientByIdRepositoryMock.getClientById.mockResolvedValue(null)

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result).toHaveProperty('valid')
  })

  it('should call verify of GetClientByClientIdRepository', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)
    getClientByIdRepositoryMock.getClientById.mockResolvedValue(null)

    const verify = jest.spyOn(getClientByIdRepositoryMock, 'getClientById')

    await verifyAuthClientRequest.verify(clientDto)

    expect(verify).toHaveBeenCalled()
  })

  it('should return false if client is not found', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)
    getClientByIdRepositoryMock.getClientById.mockResolvedValue(null)

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result.valid).toBe(false)
  })

  it('should return false if redirectUri is not valid', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)

    const client = new Client(
      'any_id',
      'any_secret',
      ['no_match_redirect_uri'],
      ['any_scope'],
      ['any_response_type']
    )

    getClientByIdRepositoryMock.getClientById.mockResolvedValue(client)

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result.valid).toBe(false)
  })

  it('should return false if scopes is not valid', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)

    const client = new Client(
      'any_id',
      'any_secret',
      ['any_redirect_uri'],
      ['no_match_scope'],
      ['any_response_type']
    )

    getClientByIdRepositoryMock.getClientById.mockResolvedValue(client)

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result.valid).toBe(false)
  })

  it('should return false if responseType is code and client don\'t have Authorization code in grant field', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)

    const client = new Client(
      'any_id',
      'any_secret',
      ['any_redirect_uri'],
      ['any_scope'],
      ['no_match_response_type']
    )

    getClientByIdRepositoryMock.getClientById.mockResolvedValue(client)

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result.valid).toBe(false)
  })

  it('should return true if client is valid', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)

    const client = new Client(
      'any_id',
      'any_secret',
      ['any_redirect_uri'],
      ['any_scope'],
      ['Authorization Code']
    )

    getClientByIdRepositoryMock.getClientById.mockResolvedValue(client)

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result.valid).toBe(true)
  })
})
