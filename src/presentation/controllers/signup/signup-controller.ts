import { Authentication, AddAccount, Controller, HttpRequest, HttpResponse, Validation } from './signup-controller-protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
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

      const accessToken = await this.authentication.auth({ email, password })

      return ok({ accessToken })
    } catch (err) {
      return serverError(err)
    }
  }
}
