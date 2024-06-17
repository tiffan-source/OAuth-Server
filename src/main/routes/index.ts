import { type Container } from '@main/configs/inversify.config.js'
import { type Router } from 'express'
import { setupUserRouter } from '@main/routes/user/user.route.js'
import { setupAuthRouter } from '@main/routes/auth/auth.route.js'

export const setupRouter = (router: Router, container: Container): void => {
  router.use('/user', setupUserRouter(container))
  router.use('/auth', setupAuthRouter(container))
}
