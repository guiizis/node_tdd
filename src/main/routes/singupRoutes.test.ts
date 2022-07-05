import request from 'supertest'
import app from '../config/app'

describe('singUp routes', () => {
  it('should return an account on success', async () => {
    await request(app)
      .post('/api/singup')
      .send({
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        passwordConfirmation: 'valid_password_confirmation'
      })
      .expect(200)
  })
})
