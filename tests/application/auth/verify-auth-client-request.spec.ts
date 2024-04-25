import { VerifyAuthClientRequest } from '@application/auth/use-cases/verify-auth-client-request.js'
import { type ClientResult, type GetClientByIdRepository } from '@data/protocols/auth/get-client-by-id.repository.js'
import { Client } from '@domain/auth/entity/client.js'
import { jest } from '@jest/globals'
import { type ClientDto } from '@application/auth/dtos/client.dto.js'

describe('VerifyAuthClientRequest', () => {
  const getClientByIdRepositoryMock: jest.Mocked<GetClientByIdRepository> = {
    getClientById: jest.fn<(id: string) => Promise<ClientResult>>()
  }

  const clientDto: ClientDto = {
    id: 'any_id',
    redirectUri: 'any_redirect_uri',
    scope: ['any_scope'],
    responseType: 'any_response_type'
  }

  it('should return data of type ValideClientDto', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)
    getClientByIdRepositoryMock.getClientById.mockResolvedValue({ client: null })

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result).toHaveProperty('valid')
  })

  it('should call verify of GetClientByIdRepository', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)
    getClientByIdRepositoryMock.getClientById.mockResolvedValue({ client: null })

    const verify = jest.spyOn(getClientByIdRepositoryMock, 'getClientById')

    await verifyAuthClientRequest.verify(clientDto)

    expect(verify).toHaveBeenCalled()
  })

  it('should return false if client is not found', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)
    getClientByIdRepositoryMock.getClientById.mockResolvedValue({ client: null })

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

    getClientByIdRepositoryMock.getClientById.mockResolvedValue({ client })

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

    getClientByIdRepositoryMock.getClientById.mockResolvedValue({ client })

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result.valid).toBe(false)
  })

  it('should return false if responseTypes is not valid', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)

    const client = new Client(
      'any_id',
      'any_secret',
      ['any_redirect_uri'],
      ['any_scope'],
      ['no_match_response_type']
    )

    getClientByIdRepositoryMock.getClientById.mockResolvedValue({ client })

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
      ['any_response_type']
    )

    getClientByIdRepositoryMock.getClientById.mockResolvedValue({ client })

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result.valid).toBe(true)
  })
})
