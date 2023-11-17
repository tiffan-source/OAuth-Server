import request from 'supertest'
import { type Application } from 'express'
import { App } from '@main/app'
import { Container } from '@main/configs/inversify.config'
import { TYPES } from '@symboles/types'
import { type DatabaseConnection } from '@data/protocols/db/database-connection'
import { faker } from '@faker-js/faker'

describe('User router', () => {
  let app: Application
  const container = new Container()

  beforeAll(async () => {
    await container.getContainer().get<DatabaseConnection>(TYPES.DatabaseConnection).connect()
    const expressApp = new App(container)
    await expressApp.start()
    app = expressApp.getApp()
  })

  afterAll(async () => {
    await container.getContainer().get<DatabaseConnection>(TYPES.DatabaseConnection).disconnect()
  })

  describe('POST /signup', () => {
    it('should return 201 status code', async () => {
      const response = await request(app).post('/api/user/').send({
        name: 'any_name',
        email: faker.internet.email(),
        password: 'any_password'
      })
      expect(response.status).toBe(201)
    })
  })
})
