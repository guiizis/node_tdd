import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongoHelper'
import { LogMongoRepository } from './log'

describe('Log Test', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  const makeSUT = (): LogMongoRepository => {
    return new LogMongoRepository()
  }

  it('should create an error log on success', async () => {
    const sut = makeSUT()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
