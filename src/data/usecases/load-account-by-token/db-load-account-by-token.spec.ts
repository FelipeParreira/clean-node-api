import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

class DecrypterStub implements Decrypter {
  async decrypt (value: string): Promise<string> {
    return 'a value'
  }
}

const makeSut = (): {sut: DbLoadAccountByToken, decrypterStub: Decrypter } => {
  const decrypterStub = new DecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return { sut, decrypterStub }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('should call decrypter with the correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const token = 'a token'
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load(token)

    expect(decryptSpy).toHaveBeenCalledTimes(1)
    expect(decryptSpy).toHaveBeenCalledWith(token)
  })
})
