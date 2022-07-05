import { DBAddAccount } from '../../data/useCases/addAccount/dbAddAccount'
import { BcryptAdapter } from '../../infra/criptography/bCryptAdapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/account'
import { SignupController } from '../../presentation/controllers/singup/singup'
import { EmailValidatorAdapter } from '../../utils/emailValidatorAdapter'

export const makeSingUpController = (): SignupController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DBAddAccount(bcryptAdapter, accountMongoRepository)
  return new SignupController(emailValidatorAdapter, dbAddAccount)
}
