import { InvalidParamError, MissingParamError } from '../../errors/index'
import { badRequest, serverError } from '../../helper/httpHelpers'
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount } from '../singup/singupProtocols'

export class SignupController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields: string[] = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, passwordConfirmation, password } = httpRequest.body

      if (passwordConfirmation !== password) {
        return badRequest(new InvalidParamError('password Confirmation'))
      }
      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = this.addAccount.add({
        name,
        email,
        password
      })

      return {
        statusCode: 200,
        body: account
      }
    } catch (error) {
      return serverError()
    }
  }
}
