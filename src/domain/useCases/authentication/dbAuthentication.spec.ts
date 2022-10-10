import { HashComparer } from '../../../data/protocols/cryptography/hashComparer'
import { TokenGenerator } from '../../../data/protocols/cryptography/tokenGenerator'
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/loadAccountByEmailRepository'
import { UpdateAccessTokenRepository } from '../../../data/protocols/db/UpdateAccessTokenRepository'
import { AccountModel } from '../../models/account'
import { AuthenticationModel } from '../authentication'
import { DbAuthentication } from './dbAuthentication'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompare: HashComparer
  tokenGenerator: TokenGenerator
  updateAccessTokenRepository: UpdateAccessTokenRepository
}

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'anyEmail@email.com',
    password: 'hashed_password'
  }
}

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new TokenGeneratorStub()
}

const makeHashCompareStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (hash: string, value: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashCompare = makeHashCompareStub()
  const tokenGenerator = makeTokenGeneratorStub()
  const updateAccessTokenRepository = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompare, tokenGenerator, updateAccessTokenRepository)
  return {
    sut,
    hashCompare,
    loadAccountByEmailRepositoryStub,
    tokenGenerator,
    updateAccessTokenRepository
  }
}

describe('dbAuthentication useCase', () => {
  it('Should call loadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should throw if loadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if loadAccountByEmailRepository returns null', async () => {
    const { loadAccountByEmailRepositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe(null)
  })

  it('Should call hashCompare with correct password', async () => {
    const { hashCompare, sut } = makeSut()
    const compareSpy = jest.spyOn(hashCompare, 'compare').mockReturnValueOnce(null)
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('Should throw if hashCompare throws', async () => {
    const { hashCompare, sut } = makeSut()
    jest.spyOn(hashCompare, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if hashCompare returns false', async () => {
    const { hashCompare, sut } = makeSut()
    jest.spyOn(hashCompare, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe(null)
  })

  it('Should call tokenGenerator with correct id', async () => {
    const { tokenGenerator, sut } = makeSut()
    const generateSpy = jest.spyOn(tokenGenerator, 'generate').mockReturnValueOnce(null)
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if tokenGenerator throws', async () => {
    const { tokenGenerator, sut } = makeSut()
    jest.spyOn(tokenGenerator, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('Should call tokenGenerator with correct id', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })

  it('Should call updateAccessTokenRepository with correct values', async () => {
    const { updateAccessTokenRepository, sut } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepository, 'update')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })
})
