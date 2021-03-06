import { AddAccount, Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from './dbAddAccountProtocols'

export class DBAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter, private readonly addAccountRepository: AddAccountRepository) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    const accountData = await this.addAccountRepository.add({ ...account, password: hashedPassword })
    return accountData
  }
}
