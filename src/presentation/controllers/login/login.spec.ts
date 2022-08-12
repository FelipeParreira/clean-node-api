import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'
import { HttpRequest } from '../../protocols/http'
import { EmailValidator } from '../../protocols/email-validator'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

const makeEmailValidator = (): EmailValidator => {
  return new EmailValidatorStub()
}

const makeSut = (): { sut: LoginController, emailValidatorStub: EmailValidator } => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return { sut, emailValidatorStub }
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

  test('should call emailValidator with the given email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledTimes(1)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })
})
