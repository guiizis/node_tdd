import { Encrypter } from '../../protocols/encrypter'
import { DBAddAccount } from './dbAddAccount'

/* eslint-disable @typescript-eslint/return-await */
interface SutTypes {
  encrypterStub: Encrypter
  sut: DBAddAccount
}

const makeSUT = (): SutTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_value'))
    }
  }

  const encrypterStub = new EncrypterStub()
  const sut = new DBAddAccount(encrypterStub)

  return {
    encrypterStub,
    sut
  }
}
describe('DBAddAccount UseCase', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSUT()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
