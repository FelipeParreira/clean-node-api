import { Collection } from 'mongodb'
import { AccountMongoRepository } from './account'
import { MongoHelper } from '../helpers/mongo-helper'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection
const accountData = {
  name: 'any name',
  email: 'email@mail.com',
  password: 'pwd'
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('should return an account on add success', async () => {
    const sut = makeSut()

    const account = await sut.add(accountData)

    expect(account).toBeTruthy()
    expect(account).toEqual({
      ...accountData,
      id: expect.any(String)
    })
  })

  test('should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({ ...accountData })

    const account = await sut.loadByEmail(accountData.email)

    expect(account).toBeTruthy()
    expect(account).toEqual({
      ...accountData,
      id: expect.any(String)
    })
  })
})
