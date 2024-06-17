import { type DatabaseConnection } from '@data/protocols/db/database-connection'
import { App } from '@main/app.js'
import { Container } from '@main/configs/inversify.config.js'
import { TYPES } from '@symboles/types.js'
import { type Application } from 'express'
import request from 'supertest'

describe('GET /api/auth', () => {
  let app: Application

  const container = new Container()

  beforeAll(async () => {
    await container.getContainer().get<DatabaseConnection>(TYPES.DatabaseConnection).connect()
    const expressApp = new App(container)
    await expressApp.start()
    app = expressApp.getApp()
  })

  it('should return 200 with forms if good request', async () => {
    await request(app)
      .get('/api/auth?clientId=testId&redirectUri=http://www.redirecturi.com&responseType=code')
      .expect(200)
  })

  it('should return 400 if bad request about validation and json response', async () => {
    const response = await request(app)
      .get('/api/auth?redirectUri=http://localhost:3000&responseType=code')
      .expect(400)

    expect(response.text).toContain('client')
  })

  it('should return 401 if non authorize client', async () => {
    const response = await request(app)
      .get('/api/auth?clientId=1234&redirectUri=http://www.redirecturi.com&responseType=Nocode')
      .expect(401)

    expect(response.text).toContain('Client')
  })

  // it('should return 401 uf non authorize redirectUri', async () => {
  //     const response = await request(app)
  //         .get('/api/auth?clientId=testId&redirectUri=http://localhost:3000&responseType=code')
  //         .expect(401)

  //     expect(response.text).toContain('redirect')
  // })
})
