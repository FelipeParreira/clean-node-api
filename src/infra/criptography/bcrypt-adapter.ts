import { Hasher } from '../../data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'

export class BCryptAdapter implements Hasher {
  constructor (
    private readonly salt: number
  ) {}

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
