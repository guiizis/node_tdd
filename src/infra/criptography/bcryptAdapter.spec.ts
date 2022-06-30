/* eslint-disable @typescript-eslint/return-await */
import { BcryptAdapter } from './bCryptAdapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hashed_value'))
  }
}))

const salt = 12
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

  it('should return a throw if bcrypt throws', async () => {
    const sut = makeSUT()
    // @ts-ignore
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })
})
