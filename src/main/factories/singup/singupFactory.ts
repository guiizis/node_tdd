import { DBAddAccount } from '../../../data/useCases/addAccount/dbAddAccount'
import { BcryptAdapter } from '../../../infra/criptography/bcryptAdapter/bCryptAdapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/accountMongoRepository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/logMongoRepository'
import { SignupController } from '../../../presentation/controllers/singup/singupController'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/logControllerDecorator'
import { makeSingUpValidation } from './singupValidationFactory'

export const makeSingUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DBAddAccount(bcryptAdapter, accountMongoRepository)
  const singUpController = new SignupController(dbAddAccount, makeSingUpValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(singUpController, logMongoRepository)
}
