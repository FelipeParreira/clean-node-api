import { HttpRequest, Validation, AddSurvey, AddSurveyModel } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { MissingParamError } from '../../../errors'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'

class ValidationStub implements Validation {
  validate (input: any): Error | undefined {
    return undefined
  }
}

class AddSurveyStub implements AddSurvey {
  async add (data: AddSurveyModel): Promise<void> {}
}

const makeSut = (): { sut: AddSurveyController, validationStub: Validation, addSurveyStub: AddSurvey } => {
  const validationStub = new ValidationStub()
  const addSurveyStub = new AddSurveyStub()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return { sut, validationStub, addSurveyStub }
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
  test('should call Validation with the correct values', async () => {
    const { sut, validationStub } = makeSut()
    const httpRequest = makeHttpRequest()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledTimes(1)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const error = new MissingParamError('some validation error')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(error))
  })

  test('should call AddSurvey with the correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 500 if AddSurvey throws an error', async () => {
    const { sut, addSurveyStub } = makeSut()
    const error = new Error('some error')
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(error)
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(error))
  })

  test('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(noContent())
  })
})
