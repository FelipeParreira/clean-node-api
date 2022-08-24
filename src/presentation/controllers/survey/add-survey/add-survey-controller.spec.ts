import { HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

class ValidationStub implements Validation {
  validate (input: any): Error | undefined {
    return undefined
  }
}

const makeSut = (): { sut: AddSurveyController, validationStub: Validation } => {
  const validationStub = new ValidationStub()
  const sut = new AddSurveyController(validationStub)
  return { sut, validationStub }
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    question: 'Any question?',
    answers: [
      {
        image: 'img.svg',
        answer: 'my answer'
      }
    ]
  }
})

describe('AddSurvey Controller', () => {
  test('should call validation with the correct values', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledTimes(1)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
