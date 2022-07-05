import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper'
import app from '../config/app'

describe('singUp routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

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
