import { MissingParamError } from '../../errors'
import { ValidationComposite } from './validation-composite'
import { Validation } from './validation'

class ValidationStub implements Validation {
  validate (input: any): Error | undefined {
    return undefined
  }
}

const makeSut = (): { sut: ValidationComposite, validationStub: Validation} => {
  const validationStub = new ValidationStub()
  const sut = new ValidationComposite([validationStub])

  return { sut, validationStub }
}

describe('Validation Composite', () => {
  test('should return the error returned by the fisrt validation that fails', () => {
    const { sut, validationStub } = makeSut()
    const validationError = new MissingParamError('field')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(validationError)
    const error = sut.validate({ field: 'value' })

    expect(error).toEqual(validationError)
  })
})
