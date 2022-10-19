import { badRequest, ok, serverError } from '../../helper/http/httpHelpers'
import { Controller, HttpRequest, HttpResponse, AddAccount, Validation } from './singupProtocolsController'

export class SignupController implements Controller {
  constructor (private readonly addAccount: AddAccount, private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body

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
