import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = { body: { name: 'someone' }, statusCode: 200 }
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
})
