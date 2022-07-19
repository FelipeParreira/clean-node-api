import { Encrypter } from '../../protocols/encrypter'
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
})
