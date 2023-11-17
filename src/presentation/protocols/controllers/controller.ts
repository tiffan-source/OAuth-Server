import { type HttpResponse } from './response/httpResponse'

export interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse>
}
