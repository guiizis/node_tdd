import { AccountModel } from '../../../../domain/models/account'

export const map = (account: any): AccountModel => {
  const { _id, ...accountWithouID } = account
  return Object.assign({}, accountWithouID)
}
