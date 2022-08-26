import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'
import { DbLoadSurveys } from './db-load-surveys'

const date = new Date()
const makeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any id',
      question: 'Any question?',
      answers: [
        {
          image: 'img.svg',
          answer: 'my answer'
        }
      ],
      date
    },
    {
      id: 'other id',
      question: 'other question?',
      answers: [
        {
          image: 'img-other.svg',
          answer: 'my other answer'
        }
      ],
      date
    }
  ]
}

class LoadSurveysRepositoryStub implements LoadSurveysRepository {
  async loadAll (): Promise<SurveyModel[]> {
    return makeSurveys()
  }
}

const makeSut = (): { sut: DbLoadSurveys, loadSurveysRepositoryStub: LoadSurveysRepository } => {
  const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return { sut, loadSurveysRepositoryStub }
}

describe('DbLoadSurveys', () => {
  test('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')

    await sut.load()

    expect(loadAllSpy).toBeCalledTimes(1)
    expect(loadAllSpy).toBeCalledWith()
  })

  test('should return the surveys returned by LoadSurveysRepository', async () => {
    const { sut } = makeSut()

    const surveys = await sut.load()

    expect(surveys).toEqual(makeSurveys())
  })

  test('should throw an error if LoadSurveysRepository throws an error', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const error = new Error('some error')
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(error)

    await expect(sut.load()).rejects.toThrow(error)
  })
})
