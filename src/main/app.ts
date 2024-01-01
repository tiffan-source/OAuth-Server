import express, { type Application, Router } from 'express'
import { type Container } from '@main/configs/inversify.config.js'
import { setupRouter } from '@main/routes/index.js'
import { bodyParser } from '@main/middlewares/body-parser.js'
import { contentType } from '@main/middlewares/content-type.js'
import { corsMiddleware } from '@main/middlewares/cors.js'
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
