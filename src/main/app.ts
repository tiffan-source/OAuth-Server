import express, { type Application, Router } from 'express'
import { bodyParser, contentType, corsMiddleware } from '@main/middlewares'
import { type Container } from './configs/inversify.config'
import { setupRouter } from './routes'

export class App {
  private readonly app: Application
  private readonly container: Container

  constructor (
    container: Container
  ) {
    this.container = container
    this.app = express()
  }

  setUpMiddlewares (): void {
    this.app.use(bodyParser)
    this.app.use(contentType)
    this.app.use(corsMiddleware)
  }

  setUpRoutes (): void {
    const router = Router()

    setupRouter(router, this.container)

    this.app.use('/api', router)
  }

  async start (): Promise<void> {
    this.setUpMiddlewares()
    this.setUpRoutes()
  }

  async listen (port: number): Promise<void> {
    await this.start()
    this.app.listen(port, () => { console.log(`Server running at http://localhost:${port}`) })
  }

  getApp (): Application {
    return this.app
  }
}
