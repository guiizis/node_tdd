import { InvalidParamError, MissingParamError } from '../errors/index'
import { badRequest, serverError } from '../helper/httpHelpers'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export class SignupController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields: string[] = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      if (httpRequest.body.passwordConfirmation !== httpRequest.body.password) {
        return badRequest(new InvalidParamError('password Confirmation'))
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
