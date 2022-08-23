import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

const makeSut = (): { sut: EmailValidation, emailValidatorStub: EmailValidator } => {
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('should return an error if the email validator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const error = sut.validate('invalid email')

    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should call email validator with the correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const email = 'valid@email.com'

    await sut.validate({ email })

    expect(isValidSpy).toBeCalledTimes(1)
    expect(isValidSpy).toBeCalledWith(email)
  })

  test('should throw if the email validator throws an error', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const error = new Error('some error')
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw error
    })

    expect(() => sut.validate({ email: 'email' })).toThrow(error)
  })
})
