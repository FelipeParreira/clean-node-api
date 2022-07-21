import { Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

class EncrypterStub implements Encrypter {
  async encrypt (pwd: string): Promise<string> {
    return await Promise.resolve('hashed pwd')
  }
}

const makeEncrypter = (): EncrypterStub => {
  return new EncrypterStub()
}
const makeSut = (): { sut: DbAddAccount, encrypterStub: Encrypter } => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('should call Encrypter with the correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add({
      name: 'a name',
      password: '123abc',
      email: 'my email'
    })

    expect(encryptSpy).toHaveBeenCalledWith('123abc')
  })

  test('should throw an error is thrown by the Encrypter', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error('some error'))

    const accountData = {
      name: 'a name',
      password: '123abc',
      email: 'my email'
    }
    return await expect(sut.add(accountData)).rejects.toThrow(new Error('some error'))
  })
})
