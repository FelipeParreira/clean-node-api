import { badRequest, ok } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation, AddSurvey } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const { question, answers } = body

    const error = this.validation.validate(body)
    if (error) {
      return badRequest(error)
    }

    await this.addSurvey.add({
      question, answers
    })
    return ok('')
  }
}