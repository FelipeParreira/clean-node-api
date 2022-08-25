import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async () => 'hashed-value',
  compare: async (): Promise<boolean> => true
}))

const salt = 12
const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

describe('BCrypt Adapter', () => {
  describe('Hash', () => {
    test('should call bcrypt.hash with the correct values', async () => {
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      const sut = makeSut()
      const value = 'any_value'
      await sut.hash(value)

      expect(hashSpy).toHaveBeenCalledTimes(1)
      expect(hashSpy).toHaveBeenCalledWith(value, salt)
    })

    test('should return a hashed value on hash success', async () => {
      const sut = makeSut()
      const value = 'any_value'
      const result = await sut.hash(value)

      expect(result).toEqual('hashed-value')
    })

    test('should throw if bcrypt.hash throws', async () => {
      const sut = makeSut()
      const error = new Error('some error')
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw error
      })
      const value = 'any_value'

      await expect(sut.hash(value)).rejects.toThrow(error)
    })
  })

  describe('Compare', () => {
    test('should call bcrypt.compare with the correct values', async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      const sut = makeSut()
      const value = 'any_value'
      const hash = 'any hash'
      await sut.compare(value, hash)

      expect(compareSpy).toHaveBeenCalledTimes(1)
      expect(compareSpy).toHaveBeenCalledWith(value, hash)
    })

    test('should return the same value returned by bcrypt.compare', async () => {
      const sut = makeSut()
      const value = 'any_value'
      const hash = 'a hash'

      let result = await sut.compare(value, hash)

      expect(result).toEqual(true)

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)

      result = await sut.compare(value, hash)

      expect(result).toEqual(false)
    })

    test('should throw if bcrypt.compare throws', async () => {
      const sut = makeSut()
      const error = new Error('some error')
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw error
      })
      const value = 'any_value'
      const hash = 'a hash'

      await expect(sut.compare(value, hash)).rejects.toThrow(error)
    })
  })
})
