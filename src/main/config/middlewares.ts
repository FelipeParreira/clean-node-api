import { Express } from 'express'
import { middlewares } from '../middlewares'

export default (app: Express): void => {
  middlewares.forEach(m => app.use(m))
}
