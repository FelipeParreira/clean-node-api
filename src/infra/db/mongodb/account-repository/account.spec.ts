import { AccountMongoRepository } from './account'
import { MongoHelper } from '../helpers/mongo-helper'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('should return an account on success', async () => {
    const sut = makeSut()
    const accountData = {
      name: 'any name',
      email: 'email@mail.com',
      password: 'pwd'
    }
    const account = await sut.add(accountData)

    expect(account).toBeTruthy()
    expect(account).toEqual({
      ...account,
      id: expect.any(String)
    })
  })
})
