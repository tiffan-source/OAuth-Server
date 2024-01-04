import request from 'supertest'
import { App } from '@main/app.js'
import { Container } from '@main/configs/inversify.config.js'
import { type Application } from 'express'
import { type DatabaseConnection } from '@data/protocols/db/database-connection.js'
import { TYPES } from '@symboles/types.js'
import { faker } from '@faker-js/faker'

describe('POST /user', () => {
  let app: Application
  const container = new Container()

  beforeAll(async () => {
    await container.getContainer().get<DatabaseConnection>(TYPES.DatabaseConnection).connect()
    const expressApp = new App(container)
    await expressApp.start()
    app = expressApp.getApp()
  })

  it('should create a new user', async () => {
    const userData = {
      name: 'JohnDoe',
      email: faker.internet.email(),
      password: 'password123'
    }

    const response = await request(app)
      .post('/api/user')
      .send(userData)

    expect(response.status).toEqual(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe(userData.name)
    expect(response.body.email).toBe(userData.email)
    expect(response.body).not.toHaveProperty('password')

    // Expect values from database

    const { name, email } = response.body

    expect(name).toEqual(userData.name)
    expect(email).toEqual(userData.email)
  })
})
