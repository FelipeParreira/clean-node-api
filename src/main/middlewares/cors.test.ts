import app from '../config/app'
import request from 'supertest'

describe('CORS Middleware', () => {
  test('should enable CORS', async () => {
    const path = '/test_cors'

    app.get(path, (req, res) => res.send())

    await request(app)
      .get(path)
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
