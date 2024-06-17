import { ServerError } from '@presentation/errors/server.errors.js'
import { type HttpResponse } from '@presentation/protocols/controllers/response/httpResponse.js'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error.message
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: (new ServerError(error.stack)).message
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error.message
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

export const notAllowPage = (data: string): HttpResponse => ({
  statusCode: 401,
  body: data
})

export const page = (data: string): HttpResponse => ({
  statusCode: 200,
  body: data
})
