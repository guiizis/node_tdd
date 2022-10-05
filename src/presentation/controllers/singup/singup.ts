import { InvalidParamError } from '../../errors/index'
import { badRequest, ok, serverError } from '../../helper/httpHelpers'
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount, Validation } from '../singup/singupProtocols'

export class SignupController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount, private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
