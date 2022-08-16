import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'
import { AuthenticationModel } from '../../../domain/usecases/authentication'

const makeAccount = (): AccountModel => ({
  id: 'an id',
  name: 'name',
  email: 'mail@mail.com',
  password: 'any password'
})

const makeAuthentication = (): AuthenticationModel => ({
  email: 'email@mail.com',
  password: '123abc'
})

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load (email: string): Promise<AccountModel> {
    return makeAccount()
  }
}

const makeSut = (): { sut: DbAuthentication, loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository } => {
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const authentication = makeAuthentication()

    await sut.auth(authentication)

    expect(loadSpy).toHaveBeenCalledTimes(1)
    expect(loadSpy).toHaveBeenCalledWith(authentication.email)
  })
})
