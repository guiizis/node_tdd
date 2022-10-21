import { AccountModel } from "../../../useCases/addAccount/dbAddAccountProtocols";

 

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<AccountModel>
}
