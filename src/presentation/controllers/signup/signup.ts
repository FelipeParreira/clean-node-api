import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from './signup-protocols'
import { badRequest, serverError } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const { body } = httpRequest
      const { name, email, password, passwordConfirmation } = body

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      this.addAccount.add({
        name,
        email,
        password
      })

      return { statusCode: 200, body: null }
    } catch (err) {
      return serverError()
    }
  }
}
