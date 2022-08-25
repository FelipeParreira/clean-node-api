import { Encrypter } from '../../../data/protocols/cryptography/encrypter'
import { Decrypter } from '../../../data/protocols/cryptography/decrypter'
import jwt from 'jsonwebtoken'

export class JWTAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }

  async decrypt (value: string): Promise<string | null> {
    await jwt.verify(value, this.secret)
    return null
  }
}
