import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  return new ValidationComposite(fields.map(f => new RequiredFieldValidation(f)))
}
