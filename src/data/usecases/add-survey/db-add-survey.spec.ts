import { AddSurveyModel, AddSurveyRepository } from './db-add-survery-protocols'
import { DbAddSurvey } from './db-add-survey'
import mockdate from 'mockdate'

const date = new Date()
const makeSurveyData = (): AddSurveyModel => ({
  question: 'a question?',
  answers: [
    { image: 'img.svg', answer: 'an answer' }
  ],
  date
})

class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {}
}

const makeSut = (): { sut: DbAddSurvey, addSurveyRepositoryStub: AddSurveyRepository} => {
  const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return { sut, addSurveyRepositoryStub }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => mockdate.set(date))
  afterAll(() => mockdate.reset())

  test('should call AddSurveyRepository with the correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const data = makeSurveyData()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')

    await sut.add(data)

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith(data)
  })

  test('should throw an error thrown by AddSurveyRepository', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const data = makeSurveyData()
    const error = new Error('some error')
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(error)

    await expect(sut.add(data)).rejects.toThrow(error)
  })
})
