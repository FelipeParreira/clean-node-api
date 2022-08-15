import { MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { LoginController } from './login'
import { HttpRequest, Authentication, Validation } from './login-protocols'
import { AuthenticationModel } from '../../../domain/usecases/authentication'

class ValidationStub implements Validation {
  validate (input: any): Error | undefined {
    return undefined
  }
}

const token = 'token'
class AuthenticationStub implements Authentication {
  async auth (authentication: AuthenticationModel): Promise<string | null> {
    return token
  }
}

const makeAuthentication = (): Authentication => {
  return new AuthenticationStub()
}

const makeSut = (): { sut: LoginController, validationStub: Validation, authenticationStub: Authentication } => {
  const validationStub = new ValidationStub()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(validationStub, authenticationStub)
  return { sut, validationStub, authenticationStub }
}

const makeHttpRequest = (overrides = {}): HttpRequest => ({
  body: {
    password: '123abc',
    email: 'mail@email.com',
    ...overrides
  }
})
describe('Login Controller', () => {
  test('should call Authentication with the correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeHttpRequest()
    const { email, password } = httpRequest.body

    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledTimes(1)
    expect(authSpy).toHaveBeenCalledWith({ email, password })
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

  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok({ accessToken: token }))
  })

  test('should call Validation with the correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toBeCalledTimes(1)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const error = new MissingParamError('some validation error')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(error))
  })
})
