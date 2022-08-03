import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const httpResponse: HttpResponse = { body: { name: 'someone' }, statusCode: 200 }
class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await Promise.resolve(httpResponse)
  }
}

class LogErrorRepositoryStub implements LogErrorRepository {
  async log (stack: string): Promise<void> {}
}

const makeErrorRepository = (): LogErrorRepository => {
  return new LogErrorRepositoryStub()
}

const makeSut = (): { sut: LogControllerDecorator, controllerStub: Controller, logErrorRepositoryStub: LogErrorRepository } => {
  const logErrorRepositoryStub = makeErrorRepository()
  const controllerStub = new ControllerStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut, controllerStub, logErrorRepositoryStub
  }
}

describe('LogControllerDecorator', () => {
  test('should call controller\'s handle', async () => {
    const { sut, controllerStub } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@me.com',
        name: 'any name',
        password: '123',
        passwordConfirmation: '123'
      }
    }
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledTimes(1)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the http response returned by the controller\'s handle', async () => {
    const { sut } = makeSut()
    const httpRequest = { body: {} }
    const response = await sut.handle(httpRequest)

    expect(response).toBe(httpResponse)
  })

  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const httpRequest = { body: {} }
    const error = new Error('')
    error.stack = 'any_stack'
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError(error))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith(error.stack)
  })
})
