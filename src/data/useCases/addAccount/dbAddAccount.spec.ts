import { Encrypter } from './dbAddAccountProtocols'
import { DBAddAccount } from './dbAddAccount'

/* eslint-disable @typescript-eslint/return-await */
interface SutTypes {
  encrypterStub: Encrypter
  sut: DBAddAccount
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_value'))
    }
  }
  return new EncrypterStub()
}

const makeSUT = (): SutTypes => {
  const encrypterStub = makeEncrypter()
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

  it('should throws if encrypter throw', async () => {
    const { sut, encrypterStub } = makeSUT()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
