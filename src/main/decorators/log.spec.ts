import { LogErrorRepository } from '../../data/protocols/db/logErrorRepository'
import { AccountModel } from '../../domain/models/account'
import { ok, serverError } from '../../presentation/helper/http/httpHelpers'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface sutType {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
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

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = ok(makeFakeAccount())
      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_error'
  return serverError(fakeError)
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

const makeSUT = (): sutType => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    logErrorRepositoryStub,
    controllerStub
  }
}

describe('LogDecorator Tests', () => {
  it('should call controller handle', async () => {
    const { controllerStub, sut } = makeSUT()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('should return the same result of controller', async () => {
    const { sut } = makeSUT()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  it('should call logErrorRepository with correct error if return a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSUT()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve) => resolve(makeServerError())))

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_error')
  })
})
