import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

class DecrypterStub implements Decrypter {
  async decrypt (value: string): Promise<string|null> {
    return 'a value'
  }
}

const makeSut = (): {sut: DbLoadAccountByToken, decrypterStub: Decrypter } => {
  const decrypterStub = new DecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return { sut, decrypterStub }
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

  test('should return null if decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)

    const result = await sut.load(token, role)

    expect(result).toBeNull()
  })
})
