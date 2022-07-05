import request from 'supertest'
import app from '../config/app'

describe('cors Middleware test', () => {
  it('should enable cors', async () => {
    app.get('/testCors', (req, res) => { res.send() })
    await request(app)
      .get('/testCors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
