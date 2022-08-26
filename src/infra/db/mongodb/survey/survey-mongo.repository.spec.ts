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
  ],
  date: new Date()
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

  describe('add', () => {
    test('should insert a survey on success', async () => {
      const sut = makeSut()
      const data = makeSurveyData()

      await sut.add(data)

      const survey = await surveyCollection.findOne({ question: data.question })

      expect(survey).toBeTruthy()
      expect(survey).toMatchObject(data)
    })
  })

  describe('loadAll', () => {
    test('should load all surveys on success', async () => {
      const sut = makeSut()
      const data = [makeSurveyData(), { ...makeSurveyData(), question: 'another one' }]
      await surveyCollection.insertMany(data)

      const surveys = await sut.loadAll()

      expect(surveys).toHaveLength(2)
      expect(surveys[0].question).toEqual(data[0].question)
      expect(surveys[1].question).toEqual(data[1].question)
    })

    test('should load all empty list if there are no surveys to load', async () => {
      const sut = makeSut()

      const surveys = await sut.loadAll()

      expect(surveys).toHaveLength(0)
    })
  })
})
