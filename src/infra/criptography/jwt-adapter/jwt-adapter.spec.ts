import jwt from 'jsonwebtoken'
import { JWTAdapter } from './jwt-adapter'

const value = 'any id'
const token = 'accessToken'
jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return token
  }
}))

describe('JWT Adapter', () => {
  test('should call sign with the correct values', async () => {
    const secret = 'secret'
    const sut = new JWTAdapter(secret)
    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt(value)

    expect(signSpy).toHaveBeenCalledTimes(1)
    expect(signSpy).toHaveBeenCalledWith({ id: value }, secret)
  })

  test('should return a token on sign success', async () => {
    const secret = 'secret'
    const sut = new JWTAdapter(secret)

    const accessToken = await sut.encrypt(value)

    expect(accessToken).toBe(token)
  })

  test('should throw if sign throws', async () => {
    const secret = 'secret'
    const sut = new JWTAdapter(secret)
    const error = new Error('some error')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw error
    })

    await expect(sut.encrypt(value)).rejects.toThrow(error)
  })
})
