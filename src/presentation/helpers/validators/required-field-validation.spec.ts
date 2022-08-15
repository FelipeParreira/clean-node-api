import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../errors/missing-param-error'

describe('Required Field Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const field = 'field'
    const sut = new RequiredFieldValidation(field)

    const error = sut.validate({ name: 'some value' })

    expect(error).toEqual(new MissingParamError(field))
  })
})
