export const TYPES = {
  RegisterUser: Symbol.for('RegisterUser'),
  DatabaseConnection: Symbol.for('DatabaseConnection'),
  CreateUserRepository: Symbol.for('CreateUserRepository'),
  Controller: Symbol.for('Controller'),
  Middleware: Symbol.for('Middleware'),
  CreateUserController: Symbol.for('CreateUserController'),
  Validation: Symbol.for('Validation'),
  EmailValidation: Symbol.for('EmailValidation'),
  RequiredValidation: Symbol.for('RequiredValidation'),
  PrismaDatabaseConnection: Symbol.for('PrismaDatabaseConnection'),
  CreateUserPrisma: Symbol.for('CreateUserPrisma'),
  HashRepository: Symbol.for('HashRepository'),
  CheckUserWithEmailRepository: Symbol.for('CheckUserWithEmailRepository'),
  VerifyAuthClientRequest: Symbol.for('VerifyAuthClientRequest'),
  LoginPageRenderer: Symbol.for('LoginPageRenderer'),
  ErrorInitiateAuthPageRenderer: Symbol.for('ErrorInitiateAuthPageRenderer'),
  UserRegisterValidation: Symbol.for('UserRegisterValidation'),
  AuthValidation: Symbol.for('AuthValidation')
}
