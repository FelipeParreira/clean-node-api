import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel } from './load-surveys-controller-protocols'
import mockdate from 'mockdate'
import { ok } from '../../../helpers/http/http-helper'

class LoadSurveysStub implements LoadSurveys {
  async load (): Promise<SurveyModel[]> {
    return makeSurveys()
  }
}

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

const makeSut = (): { sut: LoadSurveysController, loadSurveysStub: LoadSurveys } => {
  const loadSurveysStub = new LoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => mockdate.set(date))
  afterAll(() => mockdate.reset())

  test('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const httpRequest = {}
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    await sut.handle(httpRequest)

    expect(loadSpy).toHaveBeenCalledTimes(1)
    expect(loadSpy).toHaveBeenCalledWith()
  })

  test('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const httpRequest = {}
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    await sut.handle(httpRequest)

    expect(loadSpy).toHaveBeenCalledTimes(1)
    expect(loadSpy).toHaveBeenCalledWith()
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = {}

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(makeSurveys()))
  })
})
