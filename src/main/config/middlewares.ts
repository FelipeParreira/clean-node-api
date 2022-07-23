import { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser'
import { contentTypeJSON } from '../middlewares/content-type'
import { cors } from '../middlewares/cors'

const middlewares = [
  bodyParser,
  cors,
  contentTypeJSON
]

export default (app: Express): void => {
  middlewares.forEach(m => app.use(m))
}
