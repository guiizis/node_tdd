import request from 'supertest'
import app from '../config/app'

describe('bodyParser Middleware test', () => {
  it('should parser body as json', async () => {
    app.post('/testBodyParser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/testBodyParser')
      .send({ name: 'Test' })
      .expect({ name: 'Test' })
  })
})
