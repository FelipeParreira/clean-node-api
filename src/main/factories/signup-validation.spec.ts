import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('should call validation composite with all validations', () => {
    makeSignUpValidation()

    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    expect(ValidationComposite).toHaveBeenCalledTimes(1)
    expect(ValidationComposite).toHaveBeenCalledWith(
      fields.map(f => new RequiredFieldValidation(f))
    )
  })
})
