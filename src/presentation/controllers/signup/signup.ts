import { AddAccount, Controller, HttpRequest, HttpResponse, Validation } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const { name, email, password } = body

      const error = this.validation.validate(body)
      if (error) {
        return badRequest(error)
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (err) {
      return serverError(err)
    }
  }
}
