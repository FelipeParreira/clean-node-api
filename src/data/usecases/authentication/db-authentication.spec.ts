import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
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
  async load (email: string): Promise<AccountModel | null> {
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

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const error = new Error('some error')
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(error)

    await expect(sut.auth(makeAuthentication())).rejects.toThrow(error)
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(null)

    const accessToken = await sut.auth(makeAuthentication())

    expect(accessToken).toBeNull()
  })
})
