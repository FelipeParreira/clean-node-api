import { Request, Response } from 'express'
import { Controller, HttpRequest } from '../../presentation/protocols'

export const adaptRoute = (controller: Controller) => {
  return (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    void controller.handle(httpRequest).then((httpResponse) => {
      res
        .status(httpResponse.statusCode)
        .json(httpResponse.body)
    })
  }
}