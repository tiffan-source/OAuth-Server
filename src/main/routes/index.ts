import { type Container } from '@main/configs/inversify.config.js'
import { type Router } from 'express'
import { setupUserRouter } from '@main/routes/user/user.route.js'

export const setupRouter = (router: Router, container: Container): void => {
  router.use('/user', setupUserRouter(container))
}
