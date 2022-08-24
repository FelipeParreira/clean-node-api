import { AddSurveyModel, AddSurveyRepository } from '../../../../data/usecases/add-survey/db-add-survery-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveyData = { ...data }
    await surveyCollection.insertOne(surveyData)
  }
}
