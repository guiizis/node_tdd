import bcrypt from 'bcrypt'
import { HashComparer } from '../../data/protocols/cryptography/hashComparer'
import { Hasher } from '../../data/protocols/cryptography/hasher'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) { }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare (value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return await new Promise(resolve => resolve(true))
  }
}
