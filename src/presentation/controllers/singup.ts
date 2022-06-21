import { badRequest } from '../helper/httpHelpers'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignupController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields: string[] = ['name', 'email']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(field)
      }
    }
  }
}
