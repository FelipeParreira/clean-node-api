import app from '../config/app'
import request from 'supertest'

describe('Body Parser Middleware', () => {
  test('should parse body as JSON', async () => {
    const path = '/test_body_parser'

    app.post(path, (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post(path)
      .send({ name: 'John' })
      .expect({ name: 'John' })
  })
})
