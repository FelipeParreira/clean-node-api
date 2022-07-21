import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

describe('BCrypt Adapter', () => {
  test('should call bcrypt with the correct values', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const value = 'any_value'
    await sut.encrypt(value)

    expect(hashSpy).toHaveBeenCalledTimes(1)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })
})
