import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const fields = ['email', 'password']
  return new ValidationComposite([
    ...fields.map(f => new RequiredFieldValidation(f)),
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
