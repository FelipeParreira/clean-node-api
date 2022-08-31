import { InvalidParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'
import { EmailValidator } from '../protocols/email-validator'

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
