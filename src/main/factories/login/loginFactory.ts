import { DbAuthentication } from "../../../data/useCases/authentication/dbAuthentication"
import { BcryptAdapter } from "../../../infra/criptography/bcryptAdapter/bCryptAdapter"
import { JwtAdapter } from "../../../infra/criptography/jwtAdapter/jwtAdapter"
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/accountMongoRepository"
import { LogMongoRepository } from "../../../infra/db/mongodb/log/logMongoRepository"
import { LoginController } from "../../../presentation/controllers/login/loginController"
import { Controller } from "../../../presentation/protocols"
import { processEnv } from "../../config/env"
import { LogControllerDecorator } from "../../decorators/logControllerDecorator"
import { makeLoginValidation } from "./loginValidationFactory"

export const makeLoginController = (): Controller => {
  const salt = 12
  const jwtAdapter = new JwtAdapter(processEnv.jwtSecret)
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(makeLoginValidation(), dbAuthentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}