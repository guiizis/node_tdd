import { MongoHelper } from '../helpers/mongoHelper'
import { AccountMongoRepository } from './account'

describe('account test mongo', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSUT = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  it('should return an account on success', async () => {
    const sut = makeSUT()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
    expect(account.name).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email')
    expect(account.password).toBe('any_password')
  })
})
