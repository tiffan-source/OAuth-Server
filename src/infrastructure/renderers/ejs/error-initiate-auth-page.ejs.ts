import { type ErrorInitiateAuthPageRenderer } from '@presentation/protocols/renderers/error-initiate-auth-page.renderer.js'
import ejs from 'ejs'
import fs from 'fs'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class ErrorInitiateAuthPageEJS implements ErrorInitiateAuthPageRenderer {
  render (reason: string): string {
    const file = fs.readFileSync('src/infrastructure/renderers/ejs/templates/error-initiate-auth-page.ejs', 'utf-8')
    return ejs.render(file, { reason })
  }
}
