import { badRequest, ok, serverError, unauthorized } from '../../helper/http/httpHelpers'
import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './loginProtocols'

export class LoginController implements Controller {
  constructor (private readonly validation: Validation, private readonly authenticator: Authentication) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body

      const accessToken = await this.authenticator.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
