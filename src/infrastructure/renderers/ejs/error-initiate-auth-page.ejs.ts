import { type ErrorInitiateAuthPageRenderer } from '@presentation/renderers/error-initiate-auth-page.renderer'
import ejs from 'ejs'
import fs from 'fs'

export class ErrorInitiateAuthPageEJS implements ErrorInitiateAuthPageRenderer {
  render (reason: string): string {
    const file = fs.readFileSync('src/infrastructure/renderers/ejs/templates/error-initiate-auth-page.ejs', 'utf-8')
    return ejs.render(file, { reason })
  }
}
