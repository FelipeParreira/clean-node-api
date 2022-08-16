import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async () => await Promise.resolve('hashed-value')
}))

const salt = 12
const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

describe('BCrypt Adapter', () => {
  test('should call bcrypt with the correct values', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    const sut = makeSut()
    const value = 'any_value'
    await sut.hash(value)

    expect(hashSpy).toHaveBeenCalledTimes(1)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })

  test('should return a hashed value on success', async () => {
    const sut = makeSut()
    const value = 'any_value'
    const result = await sut.hash(value)

    expect(result).toEqual('hashed-value')
  })

  test('should throw if bcrypt throws', async () => {
    const sut = makeSut()
    const error = new Error('some error')
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw error
    })
    const value = 'any_value'

    await expect(sut.hash(value)).rejects.toThrow(error)
  })
})
