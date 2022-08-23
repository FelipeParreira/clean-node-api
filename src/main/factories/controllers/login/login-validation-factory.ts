import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const fields = ['email', 'password']
  return new ValidationComposite([
    ...fields.map(f => new RequiredFieldValidation(f)),
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
