import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'

const makeAccount = (): AccountModel => ({
  id: 'an id',
  name: 'name',
  email: 'mail@mail.com',
  password: 'any hashed password'
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

class HashComparerStub implements HashComparer {
  async compare (password: string, hash: string): Promise<boolean> {
    return true
  }
}

const makeSut = (): { sut: DbAuthentication, loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository, hashComparerStub: HashComparer } => {
  const hashComparerStub = new HashComparerStub()
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub
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

  test('should call HashComparer with the correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const authentication = makeAuthentication()

    await sut.auth(authentication)

    expect(compareSpy).toHaveBeenCalledTimes(1)
    expect(compareSpy).toHaveBeenCalledWith(authentication.password, makeAccount().password)
  })

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    const error = new Error('some error')
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(error)

    await expect(sut.auth(makeAuthentication())).rejects.toThrow(error)
  })

  test('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)

    const accessToken = await sut.auth(makeAuthentication())

    expect(accessToken).toBeNull()
  })
})
