import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('should return default content type as JSON', async () => {
    const path = '/test_content_type'

    app.get(path, (req, res) => res.send())

    await request(app)
      .get(path)
      .expect('Content-Type', /json/i)
  })

  test('should return XML content type if forced to', async () => {
    const path = '/test_content_type_xml'

    app.get(path, (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get(path)
      .expect('Content-Type', /xml/i)
  })
})
