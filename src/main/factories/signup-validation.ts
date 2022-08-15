import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  return new ValidationComposite([
    ...fields.map(f => new RequiredFieldValidation(f)),
    new CompareFieldsValidation('password', 'passwordConfirmation'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
