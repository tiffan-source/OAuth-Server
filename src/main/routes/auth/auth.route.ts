import { adaptController } from '@main/adapters/express-adapt-controller.js'
import { Router } from 'express'
import { TYPES } from '@symboles/types.js'
import { type Container } from '@main/configs/inversify.config.js'

export const setupAuthRouter = (container: Container): Router => {
  const router = Router()

  router.get('/', container.functionDependencies(adaptController, [TYPES.InitiateAuthRequestController])())

  return router
}
