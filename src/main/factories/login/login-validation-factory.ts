import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const fields = ['email', 'password']
  return new ValidationComposite([
    ...fields.map(f => new RequiredFieldValidation(f)),
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
