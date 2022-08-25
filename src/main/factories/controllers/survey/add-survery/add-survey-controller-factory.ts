import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { DbAddSurvey } from '../../../../../data/usecases/add-survey/db-add-survey'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo.repository'

export const makeAddSurveyController = (): Controller => {
  const validationComposite = makeAddSurveyValidation()
  const addSurveyRepository = new SurveyMongoRepository()
  const addSurvey = new DbAddSurvey(addSurveyRepository)
  const controller = new AddSurveyController(validationComposite, addSurvey)
  return makeLogControllerDecorator(controller)
}
