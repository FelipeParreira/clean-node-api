import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo.repository'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeSurveyData = (): AddSurveyModel => ({
  question: 'a question?',
  answers: [
    { image: 'img.svg', answer: 'an answer' },
    { answer: 'another answer' }
  ]
})

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
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

  test('should insert a survey on add success', async () => {
    const sut = makeSut()
    const data = makeSurveyData()

    await sut.add(data)

    const survey = await surveyCollection.findOne({ question: data.question })

    expect(survey).toBeTruthy()
    expect(survey).toMatchObject(data)
  })
})
