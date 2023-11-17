import 'module-alias/register'
import 'reflect-metadata'
import env from '@main/configs/env'
import { App } from '@main/app'
import { Container } from '@main/configs/inversify.config'
import { type DatabaseConnection } from '@data/protocols/db/database-connection'
import { TYPES } from '@symboles/types'

const container = new Container()

const app = new App(container);

(async () => {
  await app.start()
  await container.getContainer().get<DatabaseConnection>(TYPES.DatabaseConnection).connect()
  await app.listen(env.port as number)
})().then(() => {

}).catch(() => {

})
