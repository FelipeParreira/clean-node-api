import { AuthenticationModel, Authentication, AddAccount, AccountModel, AddAccountModel, HttpRequest, Validation } from './signup-controller-protocols'
import { MissingParamError, ServerError } from '../../errors'
import { SignUpController } from './signup-controller'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid-id',
  name: 'a name',
  email: 'email@mail.com',
  password: '123abc'
})
class AddAccountStub implements AddAccount {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return await Promise.resolve(makeFakeAccount())
  }
}

class ValidationStub implements Validation {
  validate (input: any): Error | undefined {
    return undefined
  }
}

const token = 'token'
class AuthenticationStub implements Authentication {
  async auth (authentication: AuthenticationModel): Promise<string | null> {
    return token
  }
}

const makeSut = (): { sut: SignUpController, addAccountStub: AddAccount, validationStub: Validation, authenticationStub: Authentication } => {
  const addAccountStub = new AddAccountStub()
  const validationStub = new ValidationStub()
  const authenticationStub = new AuthenticationStub()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

const makeHttpRequest = (overrides: any = {}): HttpRequest => ({
  body: {
    name: 'any name',
    email: 'valid@email.com',
    password: '123abc',
    passwordConfirmation: '123abc',
    ...overrides
  }
})

describe('SignUp Controller', () => {
  test('should call addAccount with the correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(addSpy).toBeCalledTimes(1)
    expect(addSpy).toBeCalledWith({
      name: 'any name',
      email: 'valid@email.com',
      password: '123abc'
    })
  })

  test('should return 500 if the addAccount throws an error', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(new Error('some error'))

    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok({ accessToken: token }))
  })

  test('should call Validation with the correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toBeCalledTimes(1)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const error = new MissingParamError('some validation error')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(error))
  })

  test('should call Authentication with the correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeHttpRequest()
    const { email, password } = httpRequest.body

    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledTimes(1)
    expect(authSpy).toHaveBeenCalledWith({ email, password })
  })

  test('should return 500 if Authentication throws an error', async () => {
    const { sut, authenticationStub } = makeSut()
    const error = new Error('some error')
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(error)
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(error))
  })
})
