import { Authentication } from '../../../domain/useCases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helper/httpHelpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../singup/singupProtocols'

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator, private readonly authenticator: Authentication) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const requiredFields: string[] = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      await this.authenticator.auth(email, password)
    } catch (error) {
      return serverError(error)
    }
  }
}
