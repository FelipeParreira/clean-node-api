import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

describe('SignUpValidation Factory', () => {
  test('should call validation composite with all validations', () => {
    makeSignUpValidation()

    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    expect(ValidationComposite).toHaveBeenCalledTimes(1)
    expect(ValidationComposite).toHaveBeenCalledWith([
      ...fields.map(f => new RequiredFieldValidation(f)),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
      new EmailValidation('email', new EmailValidatorStub())
    ]
    )
  })
})
