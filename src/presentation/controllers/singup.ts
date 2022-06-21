import { badRequest } from '../helper/httpHelpers'
import { Controller } from '../protocols/controller'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignupController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields: string[] = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(field)
      }
    }
  }
}
