import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): {sut: CompareFieldsValidation, field: string, fieldToCompare: string } => {
  const field = 'field'
  const fieldToCompare = 'fieldToCompare'
  const sut = new CompareFieldsValidation(field, fieldToCompare)
  return { sut, field, fieldToCompare }
}

describe('Compare Fields Validation', () => {
  test('should return a InvalidParamError if validation fails', () => {
    const { sut, field, fieldToCompare } = makeSut()

    const error = sut.validate({ [field]: 'some value', [fieldToCompare]: 'other value' })

    expect(error).toEqual(new InvalidParamError(fieldToCompare))
  })

  test('should return undefined if validation succeeds', () => {
    const { sut, field, fieldToCompare } = makeSut()
    const value = 'value'

    const response = sut.validate({ [field]: value, [fieldToCompare]: value })

    expect(response).not.toBeDefined()
  })
})
