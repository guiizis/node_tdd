import request from 'supertest'
import app from '../config/app'

describe('contentJson Middleware test', () => {
  it('should return default contentType as json', async () => {
    app.get('/testContentType', (req, res) => { res.send() })
    await request(app)
      .get('/testContentType')
      .expect('content-type', /json/)
  })

  it('should return xml when forced', async () => {
    app.get('/testContentTypeXML', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app)
      .get('/testContentTypeXML')
      .expect('content-type', /xml/)
  })
})
