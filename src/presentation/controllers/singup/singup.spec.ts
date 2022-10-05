/* eslint-disable @typescript-eslint/return-await */
import { MissingParamError, ServerError } from '../../errors/index'
import { HttpRequest } from '../../../presentation/protocols'
import { AccountModel, AddAccount, AddAccountModel, Validation } from '../singup/singupProtocols'
import { SignupController } from './singup'
import { badRequest, ok, serverError } from '../../helper/httpHelpers'

interface SutTypes {
  sut: SignupController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'invalid_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSUT = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignupController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SingUp Controller', () => {
  it('Should return 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSUT()

    jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  it('Should return 200 if valid data was passed', async () => {
    const { sut } = makeSUT()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  it('Should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSUT()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'invalid_email@mail.com',
      password: 'any_password'
    })
  })

  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSUT()

    const validationSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if validate throws', async () => {
    const { sut, validationStub } = makeSUT()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('missig field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('missig field')))
  })
})
