import jwt from 'jsonwebtoken'
import { JWTAdapter } from './jwt-adapter'

describe('JWT Adapter', () => {
  test('should call sign with the correct values', async () => {
    const secret = 'secret'
    const sut = new JWTAdapter(secret)
    const signSpy = jest.spyOn(jwt, 'sign')
    const value = 'any id'

    await sut.encrypt(value)

    expect(signSpy).toHaveBeenCalledTimes(1)
    expect(signSpy).toHaveBeenCalledWith({ id: value }, secret)
  })
})
