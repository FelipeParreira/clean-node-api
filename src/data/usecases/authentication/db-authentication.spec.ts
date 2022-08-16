import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

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
class TokenGeneratorStub implements TokenGenerator {
  async generate (id: string): Promise<string> {
    return token
  }
}

class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
  async update (id: string, token: string): Promise<void> {}
}

const makeSut = (): { sut: DbAuthentication, loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository, hashComparerStub: HashComparer, tokenGeneratorStub: TokenGenerator, updateAccessTokenRepositoryStub: UpdateAccessTokenRepository } => {
  const hashComparerStub = new HashComparerStub()
  const tokenGeneratorStub = new TokenGeneratorStub()
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
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

  test('should call TokenGenerator with the correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    const authentication = makeAuthentication()

    await sut.auth(authentication)

    expect(generateSpy).toHaveBeenCalledTimes(1)
    expect(generateSpy).toHaveBeenCalledWith(makeAccount().id)
  })

  test('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const error = new Error('some error')
    jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(error)

    await expect(sut.auth(makeAuthentication())).rejects.toThrow(error)
  })

  test('should return the access token on success', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeAuthentication())

    expect(accessToken).toBe(token)
  })

  test('should call UpdateAccessTokenRepository with the correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    const authentication = makeAuthentication()

    await sut.auth(authentication)

    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledWith(makeAccount().id, token)
  })
})
