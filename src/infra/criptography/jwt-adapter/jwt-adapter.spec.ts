import { JWTAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

const value = 'any id'
const token = 'accessToken'
const anotherValue = 'value'
jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return token
  },
  async verify (): Promise<string> {
    return anotherValue
  }
}))

const secret = 'secret'
const makeSut = (): JWTAdapter => {
  return new JWTAdapter(secret)
}

describe('JWT Adapter', () => {
  describe('encrypt', () => {
    test('should call sign with the correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt(value)

      expect(signSpy).toHaveBeenCalledTimes(1)
      expect(signSpy).toHaveBeenCalledWith({ id: value }, secret)
    })

    test('should return a token on sign success', async () => {
      const sut = makeSut()

      const accessToken = await sut.encrypt(value)

      expect(accessToken).toBe(token)
    })

    test('should throw if sign throws', async () => {
      const sut = makeSut()
      const error = new Error('some error')
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw error
      })

      await expect(sut.encrypt(value)).rejects.toThrow(error)
    })
  })

  describe('decrypt', () => {
    test('should call verify with the correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      const token = 'a token'

      await sut.decrypt(token)

      expect(verifySpy).toHaveBeenCalledTimes(1)
      expect(verifySpy).toHaveBeenCalledWith(token, secret)
    })

    test('should return a value on verify success', async () => {
      const sut = makeSut()

      const decryptedValue = await sut.decrypt(value)

      expect(decryptedValue).toBe(anotherValue)
    })

    test('should throw if verify throws', async () => {
      const sut = makeSut()
      const error = new Error('some error')
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw error
      })

      await expect(sut.decrypt(value)).rejects.toThrow(error)
    })
  })
})
