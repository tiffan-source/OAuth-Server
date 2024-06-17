export interface HttpResponse {
  statusCode: number
  body: Record<string, unknown> | string | null
}
