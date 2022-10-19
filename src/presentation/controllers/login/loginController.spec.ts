import { MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized, ok } from '../../helper/http/httpHelpers'
import { HttpRequest, Authentication, Validation, AuthenticationModel } from './loginProtocolsController'
import { LoginController } from './loginController'

interface SutTypes {
  sut: LoginController
  authenticatorStub: Authentication
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@email.com',
    password: 'test_password'
  }
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const makeSUT = (): SutTypes => {
  const authenticatorStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(validationStub, authenticatorStub)
  return {
    sut,
    authenticatorStub,
    validationStub
  }
}

describe('Login Controller', () => {
  it('should return 500 if auth throws', async () => {
    const { sut, authenticatorStub } = makeSUT()
    jest.spyOn(authenticatorStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(serverError(new Error()))
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticatorStub } = makeSUT()
    jest.spyOn(authenticatorStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(unauthorized())
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSUT()
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(ok({ accessToken: 'any_token' }))
  })

  it('should call Authtenticator with correct values', async () => {
    const { sut, authenticatorStub } = makeSUT()
    const authSpy = jest.spyOn(authenticatorStub, 'auth')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@email.com', password: 'test_password' })
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
