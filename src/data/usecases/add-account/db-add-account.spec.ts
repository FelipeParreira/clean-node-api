import { Encrypter, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

class EncrypterStub implements Encrypter {
  async encrypt (pwd: string): Promise<string> {
    return await Promise.resolve('hashed-pwd')
  }
}

class AddAccountRepositoryStub implements AddAccountRepository {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return await Promise.resolve({
      ...account,
      password: 'hashed-pwd',
      id: 'real-id'
    })
  }
}

const makeEncrypter = (): EncrypterStub => {
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  return new AddAccountRepositoryStub()
}
const makeSut = (): { sut: DbAddAccount, encrypterStub: Encrypter, addAccountRepositoryStub: AddAccountRepository } => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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

  test('should call AddAccountRepository with the correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'a name',
      password: '123abc',
      email: 'my email'
    }
    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: 'hashed-pwd'
    })
  })
})
