import { RequiredFieldValidation, ValidationComposite, EmailValidation } from '../../../presentation/helpers/validators'
import { makeLoginValidation } from './login-validation-factory'
import { EmailValidator } from '../../../presentation/protocols/email-validator'

jest.mock('../../../presentation/helpers/validators/validation-composite')

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

describe('LoginValidation Factory', () => {
  test('should call validation composite with all validations', () => {
    makeLoginValidation()

    const fields = ['email', 'password']
    expect(ValidationComposite).toHaveBeenCalledTimes(1)
    expect(ValidationComposite).toHaveBeenCalledWith([
      ...fields.map(f => new RequiredFieldValidation(f)),
      new EmailValidation('email', new EmailValidatorStub())
    ]
    )
  })
})
