import { EmailInUseError } from '../../errors'
import { badRequest, forbidden, ok, serverError } from '../../helper/http/httpHelpers'
import { Authentication } from '../login/loginProtocolsController'
import { Controller, HttpRequest, HttpResponse, AddAccount, Validation } from './singupProtocolsController'

export class SignupController implements Controller {
  constructor(private readonly addAccount: AddAccount, private readonly validation: Validation, private readonly authentication: Authentication) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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
      
      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const accessToken = await this.authentication.auth({email, password})
      return ok( {accessToken } )
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
