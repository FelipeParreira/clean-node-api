import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const httpResponse: HttpResponse = { body: { name: 'someone' }, statusCode: 200 }
class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await Promise.resolve(httpResponse)
  }
}

const makeSut = (): { sut: LogControllerDecorator, controllerStub: Controller} => {
  const controllerStub = new ControllerStub()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut, controllerStub
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
})
