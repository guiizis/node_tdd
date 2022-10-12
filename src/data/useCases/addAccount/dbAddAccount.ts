import { AddAccount, Hasher, AddAccountModel, AccountModel, AddAccountRepository } from './dbAddAccountProtocols'

export class DBAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)
    const accountData = await this.addAccountRepository.add({ ...account, password: hashedPassword })
    return accountData
  }
}
