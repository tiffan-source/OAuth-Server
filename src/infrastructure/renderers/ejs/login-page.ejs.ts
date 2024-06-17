import fs from 'fs'
import ejs from 'ejs'
import { type LoginPageRenderer } from '@presentation/protocols/renderers/login-page.renderer.js'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class LoginPageEJS implements LoginPageRenderer {
  render (): string {
    const file = fs.readFileSync('src/infrastructure/renderers/ejs/templates/login-page.ejs', 'utf-8')
    return ejs.render(file)
  }
}
