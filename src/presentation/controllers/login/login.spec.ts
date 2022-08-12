import { MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { LoginController } from './login'
import { HttpRequest, EmailValidator, Authentication } from './login-protocols'
import { InvalidParamError } from '../../errors/invalid-param-error'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

const makeEmailValidator = (): EmailValidator => {
  return new EmailValidatorStub()
}

class AuthenticationStub implements Authentication {
  async auth (email: string, password: string): Promise<string | null> {
    return 'token'
  }
}

const makeAuthentication = (): Authentication => {
  return new AuthenticationStub()
}

const makeSut = (): { sut: LoginController, emailValidatorStub: EmailValidator, authenticationStub: Authentication } => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return { sut, emailValidatorStub, authenticationStub }
}

const makeHttpRequest = (overrides = {}): HttpRequest => ({
  body: {
    password: '123abc',
    email: 'mail@email.com',
    ...overrides
  }
})
describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ email: undefined })
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ password: undefined })
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    isValidSpy.mockReturnValueOnce(false)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should call emailValidator with the provided email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledTimes(1)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should return 500 if the emailValidator throws an error', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const error = new Error('some weird error')
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw error
    })
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(error))
  })

  test('should call Authentication with the correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledTimes(1)
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(null)
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authentication throws an error', async () => {
    const { sut, authenticationStub } = makeSut()
    const error = new Error('some error')
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(error)
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(error))
  })
})
