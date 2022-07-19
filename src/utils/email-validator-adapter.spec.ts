import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => ({ isEmail: () => true }))

describe('EmailValidator Adapter', () => {
  test('should return false if the validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid@mail.com')
    expect(isValid).toBe(false)
  })

  test('should return true if the validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid@mail.com')
    expect(isValid).toBe(true)
  })
})
