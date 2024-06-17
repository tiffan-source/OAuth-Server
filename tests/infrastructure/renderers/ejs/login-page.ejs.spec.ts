import { LoginPageEJS } from '@infrastructure/renderers/ejs/login-page.ejs.js'

describe('LoginPageEJS', () => {
  it('should render the login-page.ejs', () => {
    // Arrange
    const loginPageEJS = new LoginPageEJS()
    // Act
    const result = loginPageEJS.render()
    // Assert
    expect(typeof result).toEqual('string')
    expect(result).toContain('POST')
    expect(result).toContain('form')
    expect(result).toContain('email')
    expect(result).toContain('password')
  })
})
