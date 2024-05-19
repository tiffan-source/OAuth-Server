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
    redirectUri: 'http://example.com/callback',
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
    expect(result.reason).toContain('Client')
  })

  /**
   * The controlle about the redirectUri is in the controller
   */

  //   it('should return false if redirectUri is not valid', async () => {
  //     const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)

  //     const client = new Client(
  //       'any_id',
  //       'any_secret',
  //       ['no_match_redirect_uri'],
  //       ['any_scope'],
  //       ['Authorization Code']
  //     )

  //     getClientByIdRepositoryMock.getClientById.mockResolvedValue(client)

  //     clientDto.redirectUri = 'no_match_redirect_uri'
  //     const result = await verifyAuthClientRequest.verify(clientDto)
  //     clientDto.redirectUri = 'http://example.com/callback'

  //     expect(result.valid).toBe(false)
  //     expect(result.reason).toContain('RedirectUri')
  //   })

  it('should return false if redirectUri doesn\'t match', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)

    const client = new Client(
      'any_id',
      'any_secret',
      ['http://example.com/callback2'],
      ['any_scope'],
      ['Authorization Code']
    )

    getClientByIdRepositoryMock.getClientById.mockResolvedValue(client)

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result.valid).toBe(false)
    expect(result.reason).toContain('RedirectUri')
  })

  it('should return false if scopes is not valid', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)

    const client = new Client(
      'any_id',
      'any_secret',
      ['http://example.com/callback'],
      ['no_match_scope'],
      ['Authorization Code']
    )

    getClientByIdRepositoryMock.getClientById.mockResolvedValue(client)

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result.valid).toBe(false)
    expect(result.reason).toContain('Scope')
    expect(result.reason).toContain('valid')
  })

  it('should return false if responseType is code and client don\'t have Authorization code in grant field', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)

    const client = new Client(
      'any_id',
      'any_secret',
      ['http://example.com/callback'],
      ['any_scope'],
      ['no_match_response_type']
    )

    getClientByIdRepositoryMock.getClientById.mockResolvedValue(client)

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result.valid).toBe(false)
  })

  it('should return false if challenge method and chalenge code are not both set', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)

    const client = new Client(
      'any_id',
      'any_secret',
      ['http://example.com/callback'],
      ['any_scope'],
      ['Authorization Code']
    )

    getClientByIdRepositoryMock.getClientById.mockResolvedValue(client)

    const result = await verifyAuthClientRequest.verify({ ...clientDto, codeChallenge: 'S256' })

    expect(result.valid).toBe(false)
    expect(result.reason).toContain('Code Challenge')
    expect(result.reason).toContain('Code Challenge Method')
  })

  it('should return false if challenge method is not valid', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)

    const client = new Client(
      'any_id',
      'any_secret',
      ['http://example.com/callback'],
      ['any_scope'],
      ['Authorization Code']
    )

    getClientByIdRepositoryMock.getClientById.mockResolvedValue(client)

    const result = await verifyAuthClientRequest.verify({ ...clientDto, codeChallenge: 'any_code_challenge', codeChallengeMethod: 'S256invalid' })

    expect(result.valid).toBe(false)
    expect(result.reason).toContain('Code Challenge Method')
    expect(result.reason).toContain('valid')
  })

  it('should return true if client is valid', async () => {
    const verifyAuthClientRequest = new VerifyAuthClientRequest(getClientByIdRepositoryMock)

    const client = new Client(
      'any_id',
      'any_secret',
      ['http://example.com/callback'],
      ['any_scope'],
      ['Authorization Code']
    )

    getClientByIdRepositoryMock.getClientById.mockResolvedValue(client)

    const result = await verifyAuthClientRequest.verify(clientDto)

    expect(result.valid).toBe(true)
  })
})
