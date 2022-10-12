import { Hasher, AddAccountModel, AccountModel, AddAccountRepository } from './dbAddAccountProtocols'
import { DBAddAccount } from './dbAddAccount'

/* eslint-disable @typescript-eslint/return-await */
interface SutTypes {
  hasherStub: Hasher
  sut: DBAddAccount
  addAccountRepositoryStub: AddAccountRepository
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_value'))
    }
  }
  return new HasherStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_value'
})

const makeFakeData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSUT = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DBAddAccount(hasherStub, addAccountRepositoryStub)

  return {
    hasherStub,
    addAccountRepositoryStub,
    sut
  }
}
describe('DBAddAccount UseCase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSUT()
    const encryptSpy = jest.spyOn(hasherStub, 'hash')

    const accountData = makeFakeData()

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('should throws if Hasher throw', async () => {
    const { sut, hasherStub } = makeSUT()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accountData = makeFakeData()

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  it('should call addAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSUT()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = makeFakeData()

    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_value'
    })
  })

  it('should throws if addAccount throw', async () => {
    const { sut, addAccountRepositoryStub } = makeSUT()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accountData = makeFakeData()

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  it('should return an account if no errors are found', async () => {
    const { sut } = makeSUT()
    const accountData = makeFakeData()

    const account = await sut.add(accountData)
    expect(account).toStrictEqual(makeFakeAccount())
  })
})
