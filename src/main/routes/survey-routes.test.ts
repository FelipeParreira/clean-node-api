import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import jwt from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('should return 403 if no token is provided', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'a question?',
          answers: [
            { answer: 'answer1', image: 'http://image.com' },
            { answer: 'answer2' }
          ]
        })
        .expect(403)
    })

    test('should return 403 if a non-admin requests it', async () => {
      const account = await accountCollection.insertOne({
        name: 'John',
        email: 'john@mail.com',
        password: '123abc'
      })
      const id = account.insertedId
      const accessToken = jwt.sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: id
      }, { $set: { accessToken } })

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'a question?',
          answers: [
            { answer: 'answer1', image: 'http://image.com' },
            { answer: 'answer2' }
          ]
        })
        .expect(403)
    })

    test('should return 204 on success', async () => {
      const account = await accountCollection.insertOne({
        name: 'John',
        email: 'john@mail.com',
        password: '123abc',
        role: 'admin'
      })
      const id = account.insertedId
      const accessToken = jwt.sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: id
      }, { $set: { accessToken } })

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'a question?',
          answers: [
            { answer: 'answer1', image: 'http://image.com' },
            { answer: 'answer2' }
          ]
        })
        .expect(204)
    })
  })
})
