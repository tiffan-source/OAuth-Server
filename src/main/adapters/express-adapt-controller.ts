import { type Controller } from '@presentation/protocols/controllers/controller.js'
import { type Request, type Response } from 'express'

export const adaptController = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {
      body: req.body,
      params: req.params,
      query: req.query
    }

    const httpResponse = await controller.handle(request)

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
