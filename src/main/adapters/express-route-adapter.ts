import { Controller, HttpRequest } from '@/presentation/protocols'
import { Request, Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    void controller.handle(httpRequest).then((httpResponse) => {
      if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
        res
          .status(httpResponse.statusCode)
          .json(httpResponse.body)
      } else {
        res
          .status(httpResponse.statusCode)
          .json({ error: httpResponse.body.message })
      }
    })
  }
}
