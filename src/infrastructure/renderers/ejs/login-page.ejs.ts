import fs from 'fs'
import ejs from 'ejs'
import { type LoginPageRenderer } from '@presentation/renderers/login-page.renderer'

export class LoginPageEJS implements LoginPageRenderer {
  render (): string {
    const file = fs.readFileSync('src/infrastructure/renderers/ejs/templates/login-page.ejs', 'utf-8')
    return ejs.render(file)
  }
}
