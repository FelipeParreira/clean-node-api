import { MissingParamError } from '../../errors'
import { ValidationComposite } from './validation-composite'
import { Validation } from './validation'

class ValidationStub implements Validation {
  validate (input: any): Error | undefined {
    return new MissingParamError('field')
  }
}

describe('Validation Composite', () => {
  test('should return the error returned by the fisrt validation that fails', () => {
    const validationError = new MissingParamError('field')
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])

    const error = sut.validate({ field: 'value' })

    expect(error).toEqual(validationError)
  })
})
