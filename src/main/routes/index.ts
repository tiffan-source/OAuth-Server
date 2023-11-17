import { type Container } from '@main/configs/inversify.config'
import { type Router } from 'express'
import { setupUserRouter } from './user/user.route'

export const setupRouter = (router: Router, container: Container): void => {
  router.use('/user', setupUserRouter(container))
}
