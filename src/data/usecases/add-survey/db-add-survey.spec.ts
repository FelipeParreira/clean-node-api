import { AddSurveyModel, AddSurveyRepository } from './db-add-survery-protocols'
import { DbAddSurvey } from './db-add-survey'

const makeSurveyData = (): AddSurveyModel => ({
  question: 'a question?',
  answers: [
    { image: 'img.svg', answer: 'an answer' }
  ]
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
  test('should call AddSurveyRepository with the correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const data = makeSurveyData()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')

    await sut.add(data)

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith(data)
  })
})
