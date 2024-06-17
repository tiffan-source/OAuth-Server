import { ErrorInitiateAuthPageEJS } from '@infrastructure/renderers/ejs/error-initiate-auth-page.ejs.js'

describe('ErrorInitiateAuthPageEJS', () => {
  it('should render the error-initiate-auth-page.ejs', () => {
    // Arrange
    const errorInitiateAuthPageEJS = new ErrorInitiateAuthPageEJS()
    const reason = 'client Id not valid'
    // Act
    const result = errorInitiateAuthPageEJS.render(reason)
    // Assert
    expect(result).toContain(reason)
  })
})
