import 'reflect-metadata'
import env from '@main/configs/env.js'
import { App } from '@main/app.js'
import { Container } from '@main/configs/inversify.config.js'
import { type DatabaseConnection } from '@data/protocols/db/database-connection.js'
import { TYPES } from '@symboles/types.js'

const container = new Container()

const app = new App(container);

(async () => {
  await app.start()
  await container.getContainer().get<DatabaseConnection>(TYPES.DatabaseConnection).connect()
  await app.listen(env.port as number)
})().then(() => {
  console.log('Server running')
}).catch((err) => {
  console.log(err)
})
