import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): {sut: RequiredFieldValidation, field: string } => {
  const field = 'field'
  const sut = new RequiredFieldValidation(field)
  return { sut, field }
}

describe('Required Field Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const { sut, field } = makeSut()

    const error = sut.validate({ name: 'some value' })

    expect(error).toEqual(new MissingParamError(field))
  })

  test('should return undefined if validation succeeds', () => {
    const { sut, field } = makeSut()

    const response = sut.validate({ [field]: 'some value' })

    expect(response).not.toBeDefined()
  })
})
