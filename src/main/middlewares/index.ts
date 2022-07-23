import { bodyParser } from './body-parser'
import { contentTypeJSON } from './content-type'
import { cors } from './cors'

export const middlewares = [
  bodyParser,
  cors,
  contentTypeJSON
]
