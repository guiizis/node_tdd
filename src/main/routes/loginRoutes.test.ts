import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper'
import app from '../config/app'

let accountCollection: Collection

describe('login routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  it('should return an account on success', async () => {
    await request(app)
      .post('/api/singup')
      .send({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      })
      .expect(200)
  })
  
  it('POST/SINGUP should return 200 on singup', async () => {
    await request(app)
      .post('/api/singup')
      .send({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      })
      .expect(200)
  })

  it('POST/LOGIN should return 200 on login', async () => {
    const password = await hash('123', 12)

    await accountCollection.insertOne({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password
    })

    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@mail.com',
        password: '123'
      })
      .expect(200)
  })

  it('POST/LOGIN should return 401 on login fail', async () => {
    const password = await hash('123', 12)

    await accountCollection.insertOne({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password
    })

    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@mail.com',
        password: '401_test'
      })
      .expect(401)
  })
})

