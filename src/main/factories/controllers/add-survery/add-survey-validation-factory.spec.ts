import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  test('should call validation composite with all validations', () => {
    makeAddSurveyValidation()

    const fields = ['question', 'answers']
    expect(ValidationComposite).toHaveBeenCalledTimes(1)
    expect(ValidationComposite).toHaveBeenCalledWith([
      ...fields.map(f => new RequiredFieldValidation(f))
    ]
    )
  })
})
