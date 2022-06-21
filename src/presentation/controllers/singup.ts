import { badRequest } from '../helper/httpHelpers'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.email) {
      return badRequest('email')
    }
    if (!httpRequest.body.name) {
      return badRequest('name')
    }
  }
}
