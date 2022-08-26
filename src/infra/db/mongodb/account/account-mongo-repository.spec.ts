import { Collection } from 'mongodb'
import { AccountMongoRepository } from './account-mongo-repository'
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

  describe('Add', () => {
    test('should return an account on add success', async () => {
      const sut = makeSut()

      const account = await sut.add(accountData)

      expect(account).toBeTruthy()
      expect(account).toEqual({
        ...accountData,
        id: expect.any(String)
      })
    })
  })

  describe('LoadByEmail', () => {
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

    test('should return null if loadByEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail(accountData.email)

      expect(account).toBeNull()
    })
  })

  describe('updateAccessToken', () => {
    test('should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const data = { ...accountData } as any
      await accountCollection.insertOne(data)
      const token = 'any token'

      expect(data.accessToken).not.toBeDefined()

      await sut.updateAccessToken(data._id, token)

      const account = await accountCollection.findOne({ _id: data._id })

      expect(account).toBeTruthy()
      expect(account?.accessToken).toEqual(token)
    })
  })

  describe('LoadByToken', () => {
    test('should return an account on loadByToken without role success', async () => {
      const sut = makeSut()
      const data = { ...accountData, accessToken: 'a token' }
      await accountCollection.insertOne({ ...data })

      const account = await sut.loadByToken(data.accessToken)

      expect(account).toBeTruthy()
      expect(account).toEqual({
        ...data,
        id: expect.any(String)
      })
    })

    test('should return an account on loadByToken with admin role success', async () => {
      const sut = makeSut()
      const data = { ...accountData, accessToken: 'a token', role: 'admin' }
      await accountCollection.insertOne({ ...data })

      const account = await sut.loadByToken(data.accessToken, data.role)

      expect(account).toBeTruthy()
      expect(account).toEqual({
        ...data,
        id: expect.any(String)
      })
    })

    test('should return null if loadByToken fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByToken('a token', 'a role')

      expect(account).toBeNull()
    })

    test('should return null on loadByToken with an invalid role', async () => {
      const sut = makeSut()
      const data = { ...accountData, accessToken: 'a token' }
      await accountCollection.insertOne({ ...data })

      const account = await sut.loadByToken(data.accessToken, 'admin')

      expect(account).toBeNull()
    })

    test('should return an account on loadByToken if user is an admin', async () => {
      const sut = makeSut()
      const data = { ...accountData, accessToken: 'a token', role: 'admin' }
      await accountCollection.insertOne({ ...data })

      const account = await sut.loadByToken(data.accessToken)

      expect(account).toBeTruthy()
      expect(account).toEqual({
        ...data,
        id: expect.any(String)
      })
    })
  })
})
