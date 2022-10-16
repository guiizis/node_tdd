import { DBAddAccount } from '../../../data/useCases/addAccount/dbAddAccount'
import { BcryptAdapter } from '../../../infra/criptography/bcryptAdapter/bCryptAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/accountRepository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/logRepository/log'
import { SignupController } from '../../../presentation/controllers/singup/singup'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSingUpValidation } from './singupValidation'

export const makeSingUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DBAddAccount(bcryptAdapter, accountMongoRepository)
  const singUpController = new SignupController(dbAddAccount, makeSingUpValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(singUpController, logMongoRepository)
}
