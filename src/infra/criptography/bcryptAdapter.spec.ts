import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bCryptAdapter'

describe('Bcrypt Adapater', () => {
  it('should call bcrypt with correct data', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
