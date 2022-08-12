import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'
import { HttpRequest } from '../../protocols/http'

const makeSut = (): { sut: LoginController } => {
  const sut = new LoginController()
  return { sut }
}

const makeHttpRequest = (overrides: any): HttpRequest => ({
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
})
