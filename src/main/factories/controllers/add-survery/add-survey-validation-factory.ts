import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const fields = ['question', 'answers']
  return new ValidationComposite([
    ...fields.map(f => new RequiredFieldValidation(f))
  ])
}
