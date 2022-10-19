import { AddAccountRepository } from '../../../../data/protocols/db/account/addAccountRepository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/loadAccountByEmailRepository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/UpdateAccessTokenRepository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/useCases/addAccount'
import { MongoHelper } from '../helpers/mongoHelper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const id = result.insertedId.toString()
    return MongoHelper.map({ ...accountData, id })
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const accountData = await accountCollection.findOne<AccountModel>({ email })
    return accountData && MongoHelper.map(accountData)
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken: token
      }
    }
    )
  }
}
