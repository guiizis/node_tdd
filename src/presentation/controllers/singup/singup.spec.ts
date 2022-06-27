import { InvalidParamError, MissingParamError, ServerError } from '../../errors/index'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from '../singup/singupProtocols'
import { SignupController } from './singup'

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      return {
        id: 'valid_id',
        name: 'valid_id',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
    }
  }
  return new AddAccountStub()
}

const makeSUT = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignupController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SingUp Controller', () => {
  it('Should return 400 if no name is provided', () => {
    const { sut } = makeSUT()
    const htppRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(htppRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 500 if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSUT()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error()
    })

    const htppRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(htppRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 400 if a invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSUT()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const htppRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(htppRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSUT()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const htppRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.handle(htppRequest)
    expect(isValidSpy).toHaveBeenCalledWith(htppRequest.body.email)
  })

  it('Should call email addAccount with correct values', () => {
    const { sut, addAccountStub } = makeSUT()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const htppRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.handle(htppRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'invalid_email@mail.com',
      password: 'any_password'
    })
  })

  it('Should return 400 if no email is provided', () => {
    const { sut } = makeSUT()
    const htppRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(htppRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    const { sut } = makeSUT()
    const htppRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(htppRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSUT()
    const htppRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(htppRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if password confirmation dosent match password', () => {
    const { sut } = makeSUT()
    const htppRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password_error'
      }
    }
    const httpResponse = sut.handle(htppRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('password Confirmation'))
  })
})
