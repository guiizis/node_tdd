import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongoHelper'
import { AccountMongoRepository } from './accountMongoRepository'

let accountCollection: Collection

describe('account test mongo', () => {
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

  const makeSUT = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  it('should return an account on add success', async () => {
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

  it('should return an account on loadByEmail success', async () => {
    const sut = makeSUT()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account.name).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  it('should return null if loadByEmail fail', async () => {
    const sut = makeSUT()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  it('should update the account access token on updateAccessToken success', async () => {
    const sut = makeSUT()
    const result = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
      expect(result['accessToken']).toBeFalsy()
      await sut.updateAccessToken(result.insertedId as unknown as string, 'any_token')
      const account = await accountCollection.findOne({_id: result.insertedId})
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
  })
})
