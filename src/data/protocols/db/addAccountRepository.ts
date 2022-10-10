import { AccountModel, AddAccountModel } from '../../useCases/addAccount/dbAddAccountProtocols'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
