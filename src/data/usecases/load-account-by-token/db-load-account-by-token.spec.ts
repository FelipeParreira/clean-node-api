import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'

const decryptedToken = 'decrypted token'
class DecrypterStub implements Decrypter {
  async decrypt (value: string): Promise<string|null> {
    return decryptedToken
  }
}

const makeAccount = (): AccountModel => ({
  id: 'an id',
  name: 'name',
  email: 'my_email@mail.com',
  password: 'any hashed password'
})

class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
  async loadByToken (token: string, role?: string | undefined): Promise<AccountModel | null> {
    return makeAccount()
  }
}

const makeSut = (): {sut: DbLoadAccountByToken, decrypterStub: Decrypter, loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository } => {
  const decrypterStub = new DecrypterStub()
  const loadAccountByTokenRepositoryStub = new LoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub }
}

const token = 'a token'
const role = 'a role'

describe('DbLoadAccountByToken Usecase', () => {
  test('should call decrypter with the correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load(token, role)

    expect(decryptSpy).toHaveBeenCalledTimes(1)
    expect(decryptSpy).toHaveBeenCalledWith(token)
  })

  test('should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)

    const result = await sut.load(token, role)

    expect(result).toBeNull()
  })

  test('should call LoadAccountByTokenRepository with the correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')

    await sut.load(token, role)

    expect(loadByTokenSpy).toHaveBeenCalledTimes(1)
    expect(loadByTokenSpy).toHaveBeenCalledWith(decryptedToken, role)
  })

  test('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)

    const result = await sut.load(token, role)

    expect(result).toBeNull()
  })

  test('should return an account if LoadAccountByTokenRepository returns an account', async () => {
    const { sut } = makeSut()

    const account = await sut.load(token, role)

    expect(account).toEqual(makeAccount())
  })
})
