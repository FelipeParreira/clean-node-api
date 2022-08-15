import { Validation } from './validation'
import { MissingParamError } from '../../errors'

export class RequiredFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string
  ) {}

  validate (input: any): Error | undefined {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName)
  }
}
