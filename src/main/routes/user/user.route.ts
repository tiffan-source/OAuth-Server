import { adaptController } from '@main/adapters/express-adapt-controller'
import { Router } from 'express'
import { TYPES } from '@symboles/types'
import { type Container } from '@main/configs/inversify.config'

export const setupUserRouter = (container: Container): Router => {
  const router = Router()

  router.post('/', container.functionDependencies(adaptController, [TYPES.CreateUserController])())

  return router
}
