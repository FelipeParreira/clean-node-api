import { AddAccount, EmailValidator, AccountModel, AddAccountModel, HttpRequest } from './signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { SignUpController } from './signup'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

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

const makeSut = (): { sut: SignUpController, emailValidatorStub: EmailValidator, addAccountStub: AddAccount } => {
  const emailValidatorStub = new EmailValidatorStub()
  const addAccountStub = new AddAccountStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
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
  test('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ name: undefined })
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ email: undefined })
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ password: undefined })
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ passwordConfirmation: undefined })
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should return 400 if password and passwordConfirmation are not equal', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest({ passwordConfirmation: 'invalid-123abc' })
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('should call email validator with the correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)

    expect(isValidSpy).toBeCalledTimes(1)
    expect(isValidSpy).toBeCalledWith('valid@email.com')
  })

  test('should return 500 if the email validator throws an error', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error('some error')
    })

    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

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

    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
