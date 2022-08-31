import { Hasher } from '@/data/protocols/cryptography/hasher'
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer'
import bcrypt from 'bcrypt'

export class BCryptAdapter implements Hasher, HashComparer {
  constructor (
    private readonly salt: number
  ) {}

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}
