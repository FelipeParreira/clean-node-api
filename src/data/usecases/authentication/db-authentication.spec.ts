import { DbAuthentication } from './db-authentication'
import {
  LoadAccountByEmailRepository,
  AccountModel,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

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

const token = 'a token'
class EncrypterStub implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return token
  }
}

class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
  async updateAccessToken (id: string, token: string): Promise<void> {}
}

const makeSut = (): { sut: DbAuthentication, loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository, hashComparerStub: HashComparer, encrypterStub: Encrypter, updateAccessTokenRepositoryStub: UpdateAccessTokenRepository } => {
  const hashComparerStub = new HashComparerStub()
  const encrypterStub = new EncrypterStub()
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
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

  test('should call Encrypter with the correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const authentication = makeAuthentication()

    await sut.auth(authentication)

    expect(encryptSpy).toHaveBeenCalledTimes(1)
    expect(encryptSpy).toHaveBeenCalledWith(makeAccount().id)
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    const error = new Error('some error')
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(error)

    await expect(sut.auth(makeAuthentication())).rejects.toThrow(error)
  })

  test('should return the access token on success', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeAuthentication())

    expect(accessToken).toBe(token)
  })

  test('should call UpdateAccessTokenRepository with the correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    const authentication = makeAuthentication()

    await sut.auth(authentication)

    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledWith(makeAccount().id, token)
  })

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const error = new Error('some error')
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(error)

    await expect(sut.auth(makeAuthentication())).rejects.toThrow(error)
  })
})
