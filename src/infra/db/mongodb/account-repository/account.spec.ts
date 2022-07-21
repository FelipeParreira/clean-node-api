import { AccountMongoRepository } from './account'
import { MongoHelper } from '../helpers/mongo-helper'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const accountData = {
      name: 'any name',
      email: 'email@mail.com',
      password: 'pwd'
    }
    const account = await sut.add(Object.freeze(accountData))

    expect(account).toBeTruthy()
    expect(account).toEqual({
      ...account,
      id: expect.any(String)
    })
  })
})
