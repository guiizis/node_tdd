import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bCryptAdapter'

const salt = 12

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  }
}))

const makeSUT = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('Bcrypt Adapater', () => {
  it('should call bcrypt with correct data', async () => {
    const sut = makeSUT()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return a hash on success', async () => {
    const sut = makeSUT()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hashed_value')
  })
})
