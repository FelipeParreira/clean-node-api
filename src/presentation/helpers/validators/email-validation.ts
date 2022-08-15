import { Validation } from './validation'
import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | undefined {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError('email')
    }
  }
}
