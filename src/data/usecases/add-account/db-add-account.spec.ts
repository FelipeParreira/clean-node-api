import { Hasher, AccountModel, AddAccountModel, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

class HasherStub implements Hasher {
  async hash (pwd: string): Promise<string> {
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

const makeHasher = (): HasherStub => {
  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  return new AddAccountRepositoryStub()
}

const makeAccount = (): AccountModel => ({
  id: 'an id',
  name: 'name',
  email: 'mail@mail.com',
  password: 'any hashed password'
})

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async loadByEmail (email: string): Promise<AccountModel | null> {
    return makeAccount()
  }
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): { sut: DbAddAccount, hasherStub: Hasher, addAccountRepositoryStub: AddAccountRepository, loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository } => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

const accountData = {
  name: 'a name',
  password: '123abc',
  email: 'my_email@mail.com'
}

describe('DbAddAccount Usecase', () => {
  test('should call Hasher with the correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(accountData)

    expect(hashSpy).toHaveBeenCalledWith('123abc')
  })

  test('should throw an error is thrown by the Hasher', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error('some error'))

    return await expect(sut.add(accountData)).rejects.toThrow(new Error('some error'))
  })

  test('should call AddAccountRepository with the correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: 'hashed-pwd'
    })
  })

  test('should throw an error is thrown by the AddAccountRepository', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error('some error'))

    return await expect(sut.add(accountData)).rejects.toThrow(new Error('some error'))
  })

  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(accountData)

    expect(account).toMatchInlineSnapshot(`
Object {
  "email": "my_email@mail.com",
  "id": "real-id",
  "name": "a name",
  "password": "hashed-pwd",
}
`)
  })

  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add(accountData)

    expect(loadSpy).toHaveBeenCalledTimes(1)
    expect(loadSpy).toHaveBeenCalledWith(accountData.email)
  })
})
