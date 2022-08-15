import { MissingParamError } from '../../errors'
import { ValidationComposite } from './validation-composite'
import { Validation } from './validation'

class ValidationStub implements Validation {
  validate (input: any): Error | undefined {
    return undefined
  }
}

const makeSut = (): { sut: ValidationComposite, validationStubs: Validation[]} => {
  const validationStubs = [new ValidationStub(), new ValidationStub()]
  const sut = new ValidationComposite(validationStubs)

  return { sut, validationStubs }
}

describe('Validation Composite', () => {
  test('should return an error any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    const validationError = new MissingParamError('field')
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(validationError)

    const error = sut.validate({ field: 'value' })

    expect(error).toEqual(validationError)
  })

  test('should return the error returned by the fisrt validation that fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    const validationError = new MissingParamError('field')
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(validationError)

    const error = sut.validate({ field: 'value' })

    expect(error).toEqual(new Error())
  })
})
