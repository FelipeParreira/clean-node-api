import setupMiddlewares from './middlewares'
import setUpRoutes from './routes'
import express from 'express'

const app = express()
setupMiddlewares(app)
setUpRoutes(app)

export default app
