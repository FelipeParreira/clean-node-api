import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../errors/missing-param-error'

const field = 'field'

describe('Required Field Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation(field)

    const error = sut.validate({ name: 'some value' })

    expect(error).toEqual(new MissingParamError(field))
  })

  test('should return undefined if validation succeeds', () => {
    const sut = new RequiredFieldValidation(field)

    const response = sut.validate({ [field]: 'some value' })

    expect(response).not.toBeDefined()
  })
})
