import { ServerError } from '@presentation/errors/server.errors'
import { type HttpResponse } from '@presentation/protocols/controllers/response/httpResponse'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})
