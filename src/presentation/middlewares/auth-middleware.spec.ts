import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'

const makeAccount = (): AccountModel => ({
  id: 'an id',
  name: 'name',
  email: 'my_email@mail.com',
  password: 'any hashed password'
})

class LoadAccountByTokenStub implements LoadAccountByToken {
  async loadByToken (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
    return makeAccount()
  }
}

const makeSut = (): { sut: AuthMiddleware, loadAccountByTokenStub: LoadAccountByToken } => {
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return { sut, loadAccountByTokenStub }
}

const makeHttpRequest = (headers = {}): HttpRequest => ({
  headers: { 'x-access-token': '123abc', ...headers }
})

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token is provided in the headers', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ 'x-access-token': undefined })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with the correct access token', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')

    await sut.handle(httpRequest)

    expect(loadSpy).toHaveBeenCalledTimes(1)
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'])
  })

  test('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const httpRequest = makeHttpRequest()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
