import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'

const makeSut = (): { sut: AuthMiddleware } => {
  const sut = new AuthMiddleware()
  return { sut }
}

const makeHttpRequest = (headers = {}): HttpRequest => ({
  headers
})

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token is provided in the headers', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
