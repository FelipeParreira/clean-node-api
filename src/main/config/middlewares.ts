import { middlewares } from '../middlewares'
import { Express } from 'express'

export default (app: Express): void => {
  middlewares.forEach(m => app.use(m))
}
