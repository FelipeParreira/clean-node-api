import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let surveyCollection: Collection

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
  })
})
